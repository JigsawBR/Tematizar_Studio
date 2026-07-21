// Cliente admin — ignora RLS para as operações de servidor.
// Este projeto usa o novo sistema de chaves: SUPABASE_SECRET_KEY (sb_secret_...)
// é injetada automaticamente em toda Edge Function e substitui a antiga
// service_role. Mantemos fallback para SUPABASE_SERVICE_ROLE_KEY por portabilidade.
import { createClient } from "npm:@supabase/supabase-js@2";

export function adminClient() {
  const secret =
    Deno.env.get("SUPABASE_SECRET_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(Deno.env.get("SUPABASE_URL")!, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
