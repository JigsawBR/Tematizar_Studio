// Edge Function: download
// Confere se o usuário logado realmente comprou o produto e devolve uma URL
// assinada e temporária do bucket privado 'arquivos'. O arquivo nunca fica público.
// auth: 'user' -> exige um usuário logado.
import { withSupabase } from "npm:@supabase/server";

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    const { data: userData } = await ctx.supabase.auth.getUser();
    const user = userData.user;
    if (!user) return Response.json({ erro: "Não autorizado." }, { status: 401 });

    const { produto_id } = await req.json();
    if (!produto_id) {
      return Response.json({ erro: "produto_id obrigatório." }, { status: 400 });
    }

    // Confere a liberação de download deste usuário para este produto.
    const { data: dl } = await ctx.supabaseAdmin
      .from("downloads")
      .select("id, arquivo_path, downloads_realizados, max_downloads, expira_em")
      .eq("user_id", user.id)
      .eq("produto_id", produto_id)
      .maybeSingle();

    if (!dl || !dl.arquivo_path) {
      return Response.json({ erro: "Arquivo indisponível para esta conta." }, { status: 403 });
    }
    if (dl.expira_em && new Date(dl.expira_em) < new Date()) {
      return Response.json({ erro: "Link expirado. Fale com a gente." }, { status: 403 });
    }
    if (dl.max_downloads != null && dl.downloads_realizados >= dl.max_downloads) {
      return Response.json({ erro: "Limite de downloads atingido." }, { status: 403 });
    }

    // URL assinada válida por 60s.
    const { data: signed, error: signErr } = await ctx.supabaseAdmin.storage
      .from("arquivos")
      .createSignedUrl(dl.arquivo_path, 60);
    if (signErr || !signed) {
      return Response.json({ erro: "Falha ao gerar link." }, { status: 500 });
    }

    await ctx.supabaseAdmin
      .from("downloads")
      .update({ downloads_realizados: dl.downloads_realizados + 1 })
      .eq("id", dl.id);

    return Response.json({ url: signed.signedUrl });
  }),
};
