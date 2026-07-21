// Edge Function: criar-pagamento
// Cria um pedido (pendente) e uma preferência de Checkout Pro no Mercado Pago.
// Preços são SEMPRE recalculados no banco — o cliente nunca define o valor.
// auth: 'user' -> exige um usuário logado (JWT). verify_jwt pode ficar ligado.
import { withSupabase } from "npm:@supabase/server";
import { adminClient } from "../_shared/admin.ts";

interface ItemEntrada {
  slug: string;
  qtd: number;
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    const MP_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
    const SITE_URL = Deno.env.get("SITE_URL") ?? "http://localhost:5173";
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    if (!MP_TOKEN) {
      return Response.json({ erro: "MP_ACCESS_TOKEN não configurado" }, { status: 500 });
    }

    // Usuário verificado pelo modo auth: 'user'.
    const { data: userData } = await ctx.supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      return Response.json({ erro: "Faça login para finalizar a compra." }, { status: 401 });
    }

    const admin = adminClient();

    const body = await req.json();
    const itensEntrada: ItemEntrada[] = Array.isArray(body?.itens) ? body.itens : [];
    const cupomCodigo: string | null = body?.cupom ?? null;
    if (itensEntrada.length === 0) {
      return Response.json({ erro: "Carrinho vazio." }, { status: 400 });
    }

    // Produtos autoritativos, buscados pelo slug (admin ignora RLS).
    const slugs = itensEntrada.map((i) => i.slug);
    const { data: produtos, error: prodErr } = await admin
      .from("produtos")
      .select("id, slug, nome, preco_centavos, ativo")
      .in("slug", slugs);
    if (prodErr || !produtos?.length) {
      return Response.json({ erro: "Produtos não encontrados." }, { status: 400 });
    }

    let subtotal = 0;
    const itensPedido: {
      produto_id: string;
      nome: string;
      preco_centavos: number;
      quantidade: number;
    }[] = [];
    const itensMP: {
      title: string;
      quantity: number;
      unit_price: number;
      currency_id: string;
    }[] = [];

    for (const entrada of itensEntrada) {
      const p = produtos.find((x) => x.slug === entrada.slug);
      if (!p || !p.ativo) continue;
      const qtd = Math.max(1, Math.floor(Number(entrada.qtd) || 1));
      subtotal += p.preco_centavos * qtd;
      itensPedido.push({
        produto_id: p.id,
        nome: p.nome,
        preco_centavos: p.preco_centavos,
        quantidade: qtd,
      });
      itensMP.push({
        title: p.nome,
        quantity: qtd,
        unit_price: p.preco_centavos / 100,
        currency_id: "BRL",
      });
    }
    if (itensPedido.length === 0) {
      return Response.json({ erro: "Carrinho inválido." }, { status: 400 });
    }

    // Cupom (opcional) — validado no banco.
    let desconto = 0;
    let cupomValido: string | null = null;
    if (cupomCodigo) {
      const { data: cupom } = await admin
        .from("cupons")
        .select("codigo, tipo, valor, ativo")
        .eq("codigo", cupomCodigo.toUpperCase())
        .eq("ativo", true)
        .maybeSingle();
      if (cupom) {
        desconto =
          cupom.tipo === "percentual"
            ? Math.round((subtotal * Number(cupom.valor)) / 100)
            : Math.min(subtotal, Math.round(Number(cupom.valor)));
        cupomValido = cupom.codigo;
      }
    }
    const total = Math.max(0, subtotal - desconto);

    // Cria o pedido (pendente).
    const { data: pedido, error: pedErr } = await admin
      .from("pedidos")
      .insert({
        user_id: user.id,
        status: "pendente",
        subtotal_centavos: subtotal,
        desconto_centavos: desconto,
        total_centavos: total,
        cupom_codigo: cupomValido,
        metodo_pagamento: "mercadopago",
      })
      .select("id")
      .single();
    if (pedErr || !pedido) {
      return Response.json({ erro: "Falha ao criar pedido." }, { status: 500 });
    }

    await admin
      .from("itens_pedido")
      .insert(itensPedido.map((i) => ({ ...i, pedido_id: pedido.id })));

    // Preferência do Checkout Pro.
    const prefBody = {
      items: itensMP,
      external_reference: pedido.id,
      payer: { email: user.email },
      back_urls: {
        success: `${SITE_URL}/pedido/sucesso`,
        pending: `${SITE_URL}/pedido/pendente`,
        failure: `${SITE_URL}/pedido/falha`,
      },
      auto_return: "approved",
      notification_url: `${SUPABASE_URL}/functions/v1/webhook-mp`,
    };

    const mpResp = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prefBody),
    });
    const pref = await mpResp.json();
    if (!mpResp.ok) {
      return Response.json(
        { erro: "Mercado Pago recusou a preferência.", detalhe: pref },
        { status: 502 },
      );
    }

    await admin
      .from("pedidos")
      .update({ pagamento_id: pref.id })
      .eq("id", pedido.id);

    return Response.json({ init_point: pref.init_point, pedido_id: pedido.id });
  }),
};
