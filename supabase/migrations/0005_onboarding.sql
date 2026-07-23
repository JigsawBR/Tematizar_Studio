-- ============================================================
-- Onboarding do cliente (tela /bem-vindo)
-- - preferências de tema no perfil
-- - marca de conclusão (para não pedir de novo)
-- - corrige o nome do perfil para logins sociais (Google)
-- Idempotente.
-- ============================================================

alter table public.perfis
  add column if not exists temas_favoritos text[] not null default '{}',
  add column if not exists onboarding_em timestamptz;

-- O gatilho lia só `nome` do metadata; o Google envia `full_name`/`name`,
-- então quem entrava pelo Google ficava com perfis.nome vazio.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id, nome, telefone)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'nome',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    ),
    new.raw_user_meta_data->>'telefone'
  )
  on conflict (id) do nothing;
  return new;
end; $$;

-- Preenche o nome de quem já entrou pelo Google antes desta correção.
update public.perfis p
set nome = coalesce(
      u.raw_user_meta_data->>'nome',
      u.raw_user_meta_data->>'full_name',
      u.raw_user_meta_data->>'name'
    )
from auth.users u
where u.id = p.id and (p.nome is null or p.nome = '');
