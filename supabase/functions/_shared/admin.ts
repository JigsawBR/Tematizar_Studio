// Cliente admin — ignora RLS para as operações de servidor.
// Este projeto usa o novo sistema de chaves: a secret key (sb_secret_...) é
// injetada automaticamente em toda Edge Function. O nome do env var varia entre
// projetos (SB_SECRET_KEY / SUPABASE_SECRET_KEY); tentamos os dois e caímos na
// service_role legada por portabilidade.
import { createClient } from "npm:@supabase/supabase-js@2";

export function adminClient() {
  const secret =
    Deno.env.get("SB_SECRET_KEY") ??
    Deno.env.get("SUPABASE_SECRET_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(Deno.env.get("SUPABASE_URL")!, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
