# Supabase — Tematizar Studio (fase 2)

Esquema pronto para a próxima fase (contas, pedidos e downloads).
Nada disso está conectado ao frontend ainda — é a base para quando ligarmos
autenticação, pagamento e entrega dos arquivos.

## Arquivos

| Arquivo | O que faz |
| --- | --- |
| `migrations/0001_schema.sql` | Tabelas, enum, triggers e RLS |
| `migrations/0002_storage.sql` | Buckets de arquivos (fotos públicas / entregáveis privados) |
| `seed.sql` | Catálogo inicial (mesmas 8 categorias e 16 produtos do site) |

Valores monetários são **sempre em centavos** (integer) para evitar erros de float.

## Como aplicar

### Opção A — SQL Editor (mais simples)
No painel do Supabase, abra **SQL Editor** e execute, nesta ordem:
1. `migrations/0001_schema.sql`
2. `migrations/0002_storage.sql`
3. `seed.sql`

### Opção B — Supabase CLI
```bash
supabase link --project-ref SEU_PROJECT_REF
supabase db push          # aplica as migrations
psql "$DATABASE_URL" -f supabase/seed.sql   # popula o catálogo
```

## Variáveis de ambiente
Copie `.env.example` para `.env` e preencha (Project Settings > API):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — **só no backend/Edge Functions**, nunca no frontend.

## Fase 2 — Auth + Pagamento (Mercado Pago)

O frontend já usa: cliente Supabase (`src/lib/supabase.ts`), store de auth
(`src/store/auth.ts`), página `/entrar`, checkout no carrinho e `/downloads`
com dados reais. Falta só ativar o backend.

### Edge Functions
| Função | Papel | Deploy |
| --- | --- | --- |
| `criar-pagamento` | Cria o pedido (preço recalculado no banco) e a preferência do Checkout Pro | `supabase functions deploy criar-pagamento` |
| `webhook-mp` | Confere o pagamento no MP e marca o pedido como `pago` | `supabase functions deploy webhook-mp --no-verify-jwt` |
| `download` | Confere a compra e gera URL assinada temporária do bucket privado | `supabase functions deploy download` |

> `webhook-mp` **precisa** de `--no-verify-jwt` — o Mercado Pago não envia JWT do Supabase.

### Passo a passo
```bash
# 1. Aplicar schema + storage + seed (ver seção "Como aplicar" acima)

# 2. Guardar os secrets (NUNCA no frontend / git)
supabase secrets set MP_ACCESS_TOKEN=SEU_ACCESS_TOKEN_DO_MERCADO_PAGO
supabase secrets set SITE_URL=https://seu-site.vercel.app
#    (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já existem automaticamente)

# 3. Deploy das funções
supabase functions deploy criar-pagamento
supabase functions deploy webhook-mp --no-verify-jwt
supabase functions deploy download

# 4. No painel do Mercado Pago, cadastrar a URL de webhook (evento "Pagamentos"):
#    https://SEU_PROJETO.supabase.co/functions/v1/webhook-mp
```

### Fluxo completo
1. Cliente logado clica em **Pagar** → `criar-pagamento` cria o pedido `pendente`
   e devolve o `init_point` → o site redireciona para o Checkout Pro.
2. Cliente paga (PIX/cartão) e volta para `/pedido/sucesso|pendente|falha`.
3. MP chama `webhook-mp` → confere o pagamento e marca o pedido como `pago`.
4. O trigger `tg_pedido_pago` gera as linhas em `public.downloads`.
5. Em **Meus Downloads**, o botão Baixar chama `download`, que valida a compra
   e devolve uma URL assinada temporária do bucket privado `arquivos`.

### Entregar os arquivos
Suba o `.studio3`/PDF de cada topo no bucket `arquivos` e preencha
`produtos.arquivo_studio_path` com o caminho. Enquanto o caminho for `null`,
a página Downloads mostra "Receber no WhatsApp" em vez do botão Baixar.
