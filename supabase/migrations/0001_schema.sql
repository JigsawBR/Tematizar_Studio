-- ============================================================
-- Tematizar Studio — esquema inicial (fase 2: contas + pedidos + downloads)
-- Valores monetários são SEMPRE em centavos (integer) para evitar erros de float.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Categorias
-- ------------------------------------------------------------
create table public.categorias (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  slug       text not null unique,
  ordem      int  not null default 0,
  criado_em  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Produtos (catálogo)
-- ------------------------------------------------------------
create table public.produtos (
  id                  uuid primary key default gen_random_uuid(),
  nome                text not null,
  slug                text not null unique,
  categoria_id        uuid references public.categorias(id) on delete set null,
  preco_centavos      int  not null check (preco_centavos >= 0),
  descricao           text,
  emoji               text,               -- placeholder atual (enquanto não há foto)
  cor_primaria        text,
  cor_secundaria      text,
  imagem_url          text,               -- foto pública (bucket 'produtos-fotos')
  arquivo_studio_path text,               -- caminho no bucket privado 'arquivos'
  arquivo_pdf_path    text,               -- idem (PDF corte com tesoura)
  ativo               boolean not null default true,
  destaque            boolean not null default false,
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now()
);
create index idx_produtos_categoria on public.produtos (categoria_id);
create index idx_produtos_ativo      on public.produtos (ativo);

-- ------------------------------------------------------------
-- Perfis (1-1 com auth.users)
-- ------------------------------------------------------------
create table public.perfis (
  id            uuid primary key references auth.users(id) on delete cascade,
  nome          text,
  telefone      text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Cupons
-- ------------------------------------------------------------
create table public.cupons (
  codigo     text primary key,
  tipo       text not null check (tipo in ('percentual','fixo')),
  valor      numeric not null check (valor >= 0), -- percentual: 0..100 | fixo: centavos
  ativo      boolean not null default true,
  validade   timestamptz,
  uso_maximo int,
  usos       int not null default 0,
  criado_em  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Pedidos
-- ------------------------------------------------------------
create type public.status_pedido as enum ('pendente','pago','cancelado','reembolsado');

create table public.pedidos (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users(id) on delete set null,
  status             public.status_pedido not null default 'pendente',
  subtotal_centavos  int not null default 0,
  desconto_centavos  int not null default 0,
  total_centavos     int not null default 0,
  cupom_codigo       text references public.cupons(codigo),
  metodo_pagamento   text,      -- 'pix' | 'cartao' | 'whatsapp'
  pagamento_id       text,      -- id no provedor (ex.: Mercado Pago)
  criado_em          timestamptz not null default now(),
  pago_em            timestamptz
);
create index idx_pedidos_user   on public.pedidos (user_id);
create index idx_pedidos_status on public.pedidos (status);

-- ------------------------------------------------------------
-- Itens do pedido (snapshot de nome/preço no momento da compra)
-- ------------------------------------------------------------
create table public.itens_pedido (
  id             uuid primary key default gen_random_uuid(),
  pedido_id      uuid not null references public.pedidos(id) on delete cascade,
  produto_id     uuid references public.produtos(id) on delete set null,
  nome           text not null,
  preco_centavos int  not null,
  quantidade     int  not null check (quantidade > 0)
);
create index idx_itens_pedido on public.itens_pedido (pedido_id);

-- ------------------------------------------------------------
-- Downloads / liberações — alimenta a página "Meus Downloads"
-- ------------------------------------------------------------
create table public.downloads (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  pedido_id            uuid not null references public.pedidos(id) on delete cascade,
  produto_id           uuid not null references public.produtos(id) on delete cascade,
  arquivo_path         text,          -- caminho no bucket privado
  downloads_realizados int not null default 0,
  max_downloads        int,           -- null = ilimitado
  expira_em            timestamptz,   -- null = sem expiração
  criado_em            timestamptz not null default now(),
  unique (pedido_id, produto_id)
);
create index idx_downloads_user on public.downloads (user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- atualiza atualizado_em automaticamente
create or replace function public.tg_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end; $$;

create trigger set_atualizado_em_produtos
  before update on public.produtos
  for each row execute function public.tg_atualizado_em();

create trigger set_atualizado_em_perfis
  before update on public.perfis
  for each row execute function public.tg_atualizado_em();

-- cria perfil ao registrar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id, nome, telefone)
  values (new.id,
          new.raw_user_meta_data->>'nome',
          new.raw_user_meta_data->>'telefone');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- pedido marcado como pago -> gera liberações de download
create or replace function public.tg_pedido_pago()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'pago'
     and old.status is distinct from 'pago'
     and new.user_id is not null then
    insert into public.downloads (user_id, pedido_id, produto_id, arquivo_path)
    select new.user_id, new.id, ip.produto_id, p.arquivo_studio_path
    from public.itens_pedido ip
    join public.produtos p on p.id = ip.produto_id
    where ip.pedido_id = new.id and ip.produto_id is not null
    on conflict (pedido_id, produto_id) do nothing;

    new.pago_em = coalesce(new.pago_em, now());
  end if;
  return new;
end; $$;

create trigger on_pedido_pago
  before update on public.pedidos
  for each row execute function public.tg_pedido_pago();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.categorias   enable row level security;
alter table public.produtos     enable row level security;
alter table public.perfis       enable row level security;
alter table public.cupons       enable row level security;
alter table public.pedidos      enable row level security;
alter table public.itens_pedido enable row level security;
alter table public.downloads    enable row level security;

-- Catálogo: leitura pública (loja aberta)
create policy "categorias leitura publica"
  on public.categorias for select using (true);

create policy "produtos ativos leitura publica"
  on public.produtos for select using (ativo = true);

create policy "cupons ativos leitura publica"
  on public.cupons for select using (ativo = true);

-- Perfis: só o dono
create policy "perfil dono select"
  on public.perfis for select using (auth.uid() = id);
create policy "perfil dono update"
  on public.perfis for update using (auth.uid() = id) with check (auth.uid() = id);

-- Pedidos: dono lê os próprios (criação/pagamento são feitos pelo backend com
-- service_role, que ignora RLS)
create policy "pedido dono select"
  on public.pedidos for select using (auth.uid() = user_id);

-- Itens: visíveis se o pedido for do usuário
create policy "itens dono select"
  on public.itens_pedido for select using (
    exists (
      select 1 from public.pedidos pe
      where pe.id = pedido_id and pe.user_id = auth.uid()
    )
  );

-- Downloads: só o dono
create policy "downloads dono select"
  on public.downloads for select using (auth.uid() = user_id);
