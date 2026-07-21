// Edge Function: webhook-mp
// Recebe as notificações do Mercado Pago e confere o pagamento na API do MP
// (fonte da verdade) antes de marcar o pedido como 'pago'. O trigger
// tg_pedido_pago então gera as liberações em public.downloads.
//
// auth: 'none' -> o MP é um provedor externo e não envia chaves do Supabase.
// A segurança vem de re-consultar o pagamento no MP: um id forjado não vira
// 'approved' e o external_reference amarra a um pedido real nosso.
// Requer verify_jwt = false (ver supabase/config.toml).
import { withSupabase } from "npm:@supabase/server";
import { adminClient } from "../_shared/admin.ts";

export default {
  fetch: withSupabase({ auth: "none" }, async (req) => {
    const MP_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
    if (!MP_TOKEN) return new Response("MP_ACCESS_TOKEN ausente", { status: 500 });

    const admin = adminClient();

    // O MP manda o id do pagamento pela query (?data.id=) e/ou pelo corpo.
    const url = new URL(req.url);
    let paymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
    const tipo = url.searchParams.get("type") ?? url.searchParams.get("topic");

    if (!paymentId) {
      const body = await req.json().catch(() => null);
      paymentId = body?.data?.id ?? body?.id ?? null;
    }

    if (tipo && tipo !== "payment") return new Response("ignorado", { status: 200 });
    if (!paymentId) return new Response("sem id", { status: 200 });

    // Consulta o pagamento no MP (nunca confiamos só na notificação).
    const mpResp = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: { Authorization: `Bearer ${MP_TOKEN}` } },
    );
    if (!mpResp.ok) return new Response("pagamento não encontrado", { status: 200 });
    const pagamento = await mpResp.json();

    const pedidoId = pagamento.external_reference as string | undefined;
    if (!pedidoId) return new Response("sem external_reference", { status: 200 });

    if (pagamento.status === "approved") {
      // Marca como pago -> o trigger gera os downloads.
      await admin
        .from("pedidos")
        .update({ status: "pago", pagamento_id: String(paymentId) })
        .eq("id", pedidoId)
        .neq("status", "pago");
    } else if (
      pagamento.status === "rejected" ||
      pagamento.status === "cancelled"
    ) {
      await admin
        .from("pedidos")
        .update({ status: "cancelado" })
        .eq("id", pedidoId)
        .eq("status", "pendente");
    }
    // 'pending'/'in_process': aguarda nova notificação.

    return new Response("ok", { status: 200 });
  }),
};
