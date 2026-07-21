// Edge Function: download
// Confere se o usuário logado realmente comprou o produto e devolve uma URL
// assinada e temporária do bucket privado 'arquivos'. O arquivo nunca fica público.
// Deploy: supabase functions deploy download
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData.user) return json({ erro: "Não autorizado." }, 401);

    const { produto_id } = await req.json();
    if (!produto_id) return json({ erro: "produto_id obrigatório." }, 400);

    // Confere a liberação de download deste usuário para este produto.
    const { data: dl } = await admin
      .from("downloads")
      .select("id, arquivo_path, downloads_realizados, max_downloads, expira_em")
      .eq("user_id", userData.user.id)
      .eq("produto_id", produto_id)
      .maybeSingle();

    if (!dl || !dl.arquivo_path) {
      return json({ erro: "Arquivo indisponível para esta conta." }, 403);
    }
    if (dl.expira_em && new Date(dl.expira_em) < new Date()) {
      return json({ erro: "Link expirado. Fale com a gente." }, 403);
    }
    if (dl.max_downloads != null && dl.downloads_realizados >= dl.max_downloads) {
      return json({ erro: "Limite de downloads atingido." }, 403);
    }

    // Gera a URL assinada (válida por 60s).
    const { data: signed, error: signErr } = await admin.storage
      .from("arquivos")
      .createSignedUrl(dl.arquivo_path, 60);
    if (signErr || !signed) return json({ erro: "Falha ao gerar link." }, 500);

    // Contabiliza o download.
    await admin
      .from("downloads")
      .update({ downloads_realizados: dl.downloads_realizados + 1 })
      .eq("id", dl.id);

    return json({ url: signed.signedUrl });
  } catch (e) {
    return json({ erro: "Erro inesperado.", detalhe: String(e) }, 500);
  }
});
