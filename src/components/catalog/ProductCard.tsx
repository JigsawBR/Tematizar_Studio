import { Link } from "react-router-dom";
import type { Produto } from "@/types";
import { brl } from "@/lib/format";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import CakePlaceholder from "@/components/catalog/CakePlaceholder";
import Icon from "@/components/ui/Icon";

interface Props {
  produto: Produto;
}

export default function ProductCard({ produto }: Props) {
  const adicionar = useCart((s) => s.adicionar);
  const mostrarToast = useUi((s) => s.mostrarToast);

  const comprar = () => {
    adicionar(produto.id);
    mostrarToast("Adicionado ao carrinho!");
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-xl2 border border-borda bg-white shadow-marca transition hover:-translate-y-1.5 hover:shadow-marca-hover">
      <Link to={`/produto/${produto.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <CakePlaceholder produto={produto} />
          <div className="absolute right-2.5 top-2.5 grid h-11 w-11 -rotate-[8deg] place-items-center rounded-full bg-white text-center font-titulo text-[0.5rem] font-extrabold leading-[1.05] text-roxo-escuro shadow-marca">
            TOPO
            <br />
            DE
            <br />
            BOLO
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/produto/${produto.id}`}>
          <h3 className="min-h-[2.4em] text-[0.95rem] font-semibold leading-tight transition hover:text-roxo-escuro">
            {produto.nome}
          </h3>
        </Link>
        <div className="text-xl font-extrabold">
          {brl(produto.preco)}{" "}
          <small className="text-[0.75rem] font-semibold text-cinza">
            no Studio
          </small>
        </div>
        <button
          onClick={comprar}
          className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-roxo py-2.5 font-titulo font-bold text-white transition hover:bg-roxo-escuro"
        >
          Comprar <Icon name="cart" size={17} />
        </button>
      </div>
    </article>
  );
}
