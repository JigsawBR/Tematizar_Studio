// ===========================================================
// ⚙️ CONFIGURAÇÃO DA LOJA — edite aqui
// ===========================================================

/** Número do WhatsApp com DDI + DDD, apenas dígitos. Ex.: 5511999999999 */
export const WHATSAPP = "5511999999999";

/** Cupons de desconto — código : fração (0.10 = 10%) */
export const CUPONS: Record<string, number> = {
  PRIMEIRACOMPRA: 0.1,
};

/** Texto da barra de promoção no topo (use {cupom} para inserir o código) */
export const PROMO_CUPOM = "PRIMEIRACOMPRA";
