-- ============================================================
-- Seed — dados iniciais (mesmo catálogo do site)
-- Preços em CENTAVOS.
-- ============================================================

insert into public.categorias (nome, slug, ordem) values
  ('Meninas',     'meninas',     1),
  ('Meninos',     'meninos',     2),
  ('Chá de Bebê', 'cha-de-bebe', 3),
  ('Páscoa',      'pascoa',      4),
  ('Formatura',   'formatura',   5),
  ('Religioso',   'religioso',   6),
  ('Datas',       'datas',       7),
  ('Diversos',    'diversos',    8)
on conflict (slug) do nothing;

insert into public.produtos
  (nome, slug, categoria_id, preco_centavos, emoji, cor_primaria, cor_secundaria, destaque)
values
  ('Topo de Bolo Ursinho Chá Revelação', 'ursinho-cha-revelacao', (select id from public.categorias where slug='cha-de-bebe'), 500, '🧸', '#8ecae6', '#219ebc', true),
  ('Topo de Bolo Coelho da Páscoa',      'coelho-da-pascoa',      (select id from public.categorias where slug='pascoa'),      500, '🐰', '#a7d8b0', '#52b788', true),
  ('Topo de Bolo Fundo do Mar / Sereia', 'fundo-do-mar-sereia',   (select id from public.categorias where slug='meninas'),     500, '🧜‍♀️', '#90e0ef', '#0096c7', true),
  ('Topo de Bolo Astronauta no Espaço',  'astronauta-no-espaco',  (select id from public.categorias where slug='meninos'),     600, '🚀', '#b8c0ff', '#5a67d8', true),
  ('Topo de Bolo Jardim Encantado',      'jardim-encantado',      (select id from public.categorias where slug='meninas'),     500, '🌸', '#ffd6e0', '#f582ae', true),
  ('Topo de Bolo Fazendinha',            'fazendinha',            (select id from public.categorias where slug='meninos'),     600, '🐮', '#ffe066', '#f4a261', true),
  ('Topo de Bolo Circo Divertido',       'circo-divertido',       (select id from public.categorias where slug='diversos'),    500, '🎪', '#ff8fab', '#e63946', true),
  ('Topo de Bolo Dinossauro',            'dinossauro',            (select id from public.categorias where slug='meninos'),     700, '🦕', '#95d5b2', '#40916c', true),
  ('Topo de Bolo Unicórnio',             'unicornio',             (select id from public.categorias where slug='meninas'),     500, '🦄', '#e0c3fc', '#8e7dbe', false),
  ('Topo de Bolo Futebol',               'futebol',               (select id from public.categorias where slug='meninos'),     600, '⚽', '#a9def9', '#3a86ff', false),
  ('Topo de Bolo ABC / Formatura',       'abc-formatura',         (select id from public.categorias where slug='formatura'),   500, '🎓', '#ffd670', '#ff9770', false),
  ('Topo de Bolo Batizado',              'batizado',              (select id from public.categorias where slug='religioso'),   500, '🕊️', '#cfe1f2', '#7ea8be', false),
  ('Topo de Bolo Festa Junina',          'festa-junina',          (select id from public.categorias where slug='datas'),       600, '🌽', '#ffb703', '#fb8500', false),
  ('Topo de Bolo Natal',                 'natal',                 (select id from public.categorias where slug='datas'),       500, '🎄', '#e5989b', '#c1121f', false),
  ('Topo de Bolo Safari / Selva',        'safari-selva',          (select id from public.categorias where slug='meninos'),     700, '🦁', '#d4e09b', '#a3b18a', false),
  ('Topo de Bolo Bailarina',             'bailarina',             (select id from public.categorias where slug='meninas'),     500, '🩰', '#ffcad4', '#ee6c9a', false)
on conflict (slug) do nothing;

insert into public.cupons (codigo, tipo, valor, ativo) values
  ('PRIMEIRACOMPRA', 'percentual', 10, true)
on conflict (codigo) do nothing;
