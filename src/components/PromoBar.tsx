import { PROMO_CUPOM } from "../config";

export default function PromoBar() {
  return (
    <div className="relative bg-gradient-to-r from-roxo to-rosa px-11 py-2.5 text-center text-sm font-bold tracking-wide text-white">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg opacity-70">
        ‹
      </span>
      USE O CUPOM <b className="text-creme">{PROMO_CUPOM}</b> PARA TER 10% DE
      DESCONTO!
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg opacity-70">
        ›
      </span>
    </div>
  );
}
