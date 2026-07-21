-- ============================================================
-- Buckets de armazenamento
-- ============================================================

-- Fotos dos produtos (públicas)
insert into storage.buckets (id, name, public)
values ('produtos-fotos', 'produtos-fotos', true)
on conflict (id) do nothing;

-- Arquivos digitais entregáveis (.studio3 / PDF) — PRIVADOS
insert into storage.buckets (id, name, public)
values ('arquivos', 'arquivos', false)
on conflict (id) do nothing;

-- Fotos: leitura pública
create policy "fotos leitura publica"
  on storage.objects for select
  using (bucket_id = 'produtos-fotos');

-- IMPORTANTE: o bucket 'arquivos' NÃO tem policy de leitura para o cliente.
-- O download é liberado por uma Edge Function (service_role) que:
--   1. confere se existe um registro em public.downloads para (user, produto);
--   2. valida limite/expiração;
--   3. gera uma URL assinada e temporária (createSignedUrl) para o arquivo.
-- Assim o arquivo nunca fica acessível sem compra confirmada.
