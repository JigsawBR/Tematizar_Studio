// Edge Function: webhook-mp
// Recebe as notificações do Mercado Pago, confere o pagamento na API do MP
// (fonte da verdade) e marca o pedido como 'pago'. O trigger tg_pedido_pago
// então gera as liberações em public.downloads.
// Deploy: supabase functions deploy webhook-mp --no-verify-jwt
//   (o MP não envia JWT do Supabase, por isso --no-verify-jwt)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const MP_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
    if (!MP_TOKEN) return new Response("MP_ACCESS_TOKEN ausente", { status: 500 });

    // O MP manda o id do pagamento pela query (?data.id=) e/ou pelo corpo.
    const url = new URL(req.url);
    let paymentId =
      url.searchParams.get("data.id") ?? url.searchParams.get("id");
    const tipo = url.searchParams.get("type") ?? url.searchParams.get("topic");

    if (!paymentId) {
      const body = await req.json().catch(() => null);
      paymentId = body?.data?.id ?? body?.id ?? null;
    }

    // Só nos interessa notificação de pagamento.
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

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

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
    // 'pending'/'in_process': não faz nada, aguarda nova notificação.

    return new Response("ok", { status: 200 });
  } catch (e) {
    // Responde 200 para o MP não reenviar em loop por erro nosso;
    // logs ficam registrados no painel do Supabase.
    console.error("webhook-mp erro:", e);
    return new Response("ok", { status: 200 });
  }
});
