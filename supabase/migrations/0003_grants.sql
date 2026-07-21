-- ============================================================
-- Grants dos papéis do Supabase nas tabelas do schema public.
--
-- Sintoma que isto corrige: as Edge Functions (backend) recebiam
--   "permission denied for table produtos"
-- ao consultar o catálogo. RLS nunca gera "permission denied" (ela apenas
-- filtra linhas) — o erro é falta de GRANT a nível de tabela. As tabelas
-- criadas em 0001_schema.sql não herdaram os grants dos papéis, então nem o
-- service_role (usado pelo backend) conseguia ler.
--
-- O RLS continua valendo: os grants abaixo só liberam a operação; QUAIS linhas
-- cada papel enxerga continua definido pelas policies de 0001_schema.sql.
-- ============================================================

grant usage on schema public to anon, authenticated, service_role;

-- Backend (service_role / sb_secret): acesso total. Ele já ignora RLS, mas
-- ainda precisa do privilégio de tabela.
grant all privileges on all tables    in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant all privileges on all routines  in schema public to service_role;

-- Catálogo público (loja aberta): leitura para visitantes e logados.
-- As policies "... leitura publica" de 0001 restringem às linhas certas.
grant select on public.categorias to anon, authenticated;
grant select on public.produtos   to anon, authenticated;
grant select on public.cupons     to anon, authenticated;

-- Área logada: RLS filtra por dono (auth.uid()).
grant select         on public.pedidos      to authenticated;
grant select         on public.itens_pedido to authenticated;
grant select         on public.downloads    to authenticated;
grant select, update on public.perfis       to authenticated;

-- Novas tabelas futuras já nascem com os grants corretos.
alter default privileges in schema public
  grant all privileges on tables to service_role;
alter default privileges in schema public
  grant all privileges on sequences to service_role;
