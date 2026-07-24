import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/store/cart";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { useUi } from "@/store/ui";
import { useAuth } from "@/store/auth";
import { useCatalog } from "@/store/catalog";
import { supabase } from "@/lib/supabase";
import { brl } from "@/lib/format";
import CakePlaceholder from "@/components/catalog/CakePlaceholder";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

export default function CartDrawer() {
  const { itens, cupom, desconto, mudarQtd, remover, aplicarCupom } = useCart();
  const { carrinhoAberto, fecharCarrinho, mostrarToast } = useUi();
  const user = useAuth((s) => s.user);
  const PRODUTOS = useCatalog((s) => s.produtos);
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLElement>(null);
  useFocusTrap(carrinhoAberto, drawerRef);
  const [pagando, setPagando] = useState(false);

  const [codigoCupom, setCodigoCupom] = useState("");
  const [cupomMsg, setCupomMsg] = useState<{ texto: string; ok: boolean } | null>(
    null,
  );

  // fecha com ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharCarrinho();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fecharCarrinho]);

  const subtotal = useMemo(
    () =>
      itens.reduce((soma, i) => {
        const p = PRODUTOS.find((x) => x.id === i.id);
        return soma + (p ? p.preco * i.qtd : 0);
      }, 0),
    [itens, PRODUTOS],
  );
  const valorDesconto = subtotal * desconto;
  const total = subtotal - valorDesconto;

  const onAplicarCupom = () => {
    const ok = aplicarCupom(codigoCupom);
    if (ok) {
      const pct = (useCart.getState().desconto * 100).toFixed(0);
      setCupomMsg({ texto: `Cupom aplicado: ${pct}% de desconto!`, ok: true });
    } else {
      setCupomMsg({ texto: "Cupom inválido.", ok: false });
    }
  };

  const pagarMercadoPago = async () => {
    if (itens.length === 0) return;
    if (!user) {
      fecharCarrinho();
      mostrarToast("Entre na sua conta para finalizar.");
      navigate("/entrar?redirect=/downloads");
      return;
    }
    setPagando(true);
    const payload = itens
      .map((i) => {
        const p = PRODUTOS.find((x) => x.id === i.id);
        return p ? { slug: p.slug, qtd: i.qtd } : null;
      })
      .filter(Boolean);

    const { data, error } = await supabase.functions.invoke("criar-pagamento", {
      body: { itens: payload, cupom: cupom || null },
    });
    setPagando(false);

    if (error || !data?.init_point) {
      mostrarToast("Não foi possível iniciar o pagamento. Tente novamente.");
      return;
    }
    window.location.href = data.init_point;
  };

  return (
    <>
      {/* overlay */}
      <div
        onClick={fecharCarrinho}
        className={`fixed inset-0 z-40 bg-ameixa/45 transition ${
          carrinhoAberto ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* drawer */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        aria-hidden={!carrinhoAberto}
        tabIndex={-1}
        className={`fixed right-0 top-0 z-50 flex h-full w-[400px] max-w-[90vw] flex-col bg-white shadow-[-10px_0_40px_rgba(0,0,0,.2)] outline-none transition-transform duration-300 ${
          carrinhoAberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-roxo to-rosa px-5 py-5 text-white">
          <h2 className="flex items-center gap-2 text-xl">
            <Icon name="cart" size={22} /> Seu carrinho
          </h2>
          <button
            onClick={fecharCarrinho}
            aria-label="Fechar carrinho"
            className="leading-none"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {itens.length === 0 ? (
            <div className="px-5 py-12 text-center text-cinza">
              <span className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-roxo-claro text-roxo-escuro">
                <Icon name="cart" size={30} />
              </span>
              Seu carrinho está vazio.
              <br />
              Escolha seus topos favoritos!
            </div>
          ) : (
            itens.map((i) => {
              const p = PRODUTOS.find((x) => x.id === i.id);
              if (!p) return null;
              return (
                <div
                  key={i.id}
                  className="mb-3 flex items-center gap-3 rounded-2xl bg-creme p-3"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[10px] bg-roxo-claro">
                    <CakePlaceholder produto={p} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-titulo text-[0.85rem] font-semibold leading-tight">
                      {p.nome}
                    </h4>
                    <div className="font-titulo text-[0.95rem] font-extrabold text-roxo-escuro">
                      {brl(p.preco)}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <BotaoQtd label="Diminuir" onClick={() => mudarQtd(i.id, -1)}>
                        −
                      </BotaoQtd>
                      <span className="min-w-[20px] text-center text-[0.85rem] font-bold">
                        {i.qtd}
                      </span>
                      <BotaoQtd label="Aumentar" onClick={() => mudarQtd(i.id, 1)}>
                        +
                      </BotaoQtd>
                    </div>
                  </div>
                  <button
                    onClick={() => remover(i.id)}
                    aria-label="Remover"
                    className="self-start text-cinza transition hover:text-rosa-escuro"
                  >
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {itens.length > 0 && (
          <div className="border-t border-borda bg-white px-5 py-4.5">
            <div className="mb-3.5 flex gap-2">
              <input
                type="text"
                value={codigoCupom}
                onChange={(e) => setCodigoCupom(e.target.value)}
                placeholder="Cupom de desconto"
                className="min-w-0 flex-1 rounded-[10px] border-2 border-borda px-3.5 py-2.5 font-corpo font-bold uppercase focus:border-roxo focus:outline-none"
              />
              <Button variant="dark" onClick={onAplicarCupom}>
                Aplicar
              </Button>
            </div>
            {cupomMsg && (
              <div
                className={`-mt-2 mb-3 min-h-[1em] text-[0.78rem] font-bold ${
                  cupomMsg.ok ? "text-roxo-escuro" : "text-rosa-escuro"
                }`}
              >
                {cupomMsg.texto}
              </div>
            )}

            <div className="mb-1.5 flex justify-between text-[0.9rem] font-bold text-cinza">
              <span>Subtotal</span>
              <span>{brl(subtotal)}</span>
            </div>
            {desconto > 0 && (
              <div className="mb-1.5 flex justify-between text-[0.9rem] font-bold text-roxo-escuro">
                <span>Desconto</span>
                <span>- {brl(valorDesconto)}</span>
              </div>
            )}
            <div className="mb-4 flex justify-between font-titulo text-[1.4rem] text-ameixa">
              <span>Total</span>
              <b className="text-roxo-escuro">{brl(total)}</b>
            </div>

            <Button
              variant="primary"
              size="lg"
              full
              disabled={pagando}
              onClick={pagarMercadoPago}
              icon={pagando ? undefined : <Icon name="card" size={20} />}
            >
              {pagando ? "Abrindo pagamento..." : "Pagar (PIX ou cartão)"}
            </Button>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[0.72rem] font-bold text-cinza">
              <Icon name="lock" size={13} /> Pagamento seguro via Mercado Pago
            </div>
            <p className="mt-1.5 text-center text-[0.75rem] text-cinza">
              Após o pagamento, seu arquivo fica em “Meus Downloads” para baixar.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

function BotaoQtd({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-6 w-6 place-items-center rounded-md bg-roxo-claro font-extrabold text-roxo-escuro"
    >
      {children}
    </button>
  );
}
