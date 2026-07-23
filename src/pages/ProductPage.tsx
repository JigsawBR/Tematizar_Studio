import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { brl } from "@/lib/format";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import { useCatalog } from "@/store/catalog";
import CakePlaceholder from "@/components/catalog/CakePlaceholder";
import ProductGrid from "@/components/catalog/ProductGrid";
import Icon from "@/components/ui/Icon";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

export default function ProductPage() {
  const { id } = useParams();
  const produtos = useCatalog((s) => s.produtos);
  const carregando = useCatalog((s) => s.carregando);
  const produto = produtos.find((p) => p.id === Number(id));

  const adicionar = useCart((s) => s.adicionar);
  const mudarQtd = useCart((s) => s.mudarQtd);
  const { abrirCarrinho, mostrarToast } = useUi();

  const [qtd, setQtd] = useState(1);

  if (carregando) {
    return (
      <div className="mx-auto grid max-w-conteudo grid-cols-1 gap-8 px-5 py-8 md:grid-cols-2">
        <Skeleton className="aspect-square rounded-xl2" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-9 w-4/5" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="mt-2 h-14 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="mx-auto max-w-conteudo px-5 py-20 text-center">
        <h1 className="mb-2 text-2xl font-extrabold">Produto não encontrado</h1>
        <p className="mb-6 text-cinza">
          Este topo não existe ou saiu do catálogo.
        </p>
        <Button to="/catalogo" variant="primary">
          Voltar ao catálogo
        </Button>
      </div>
    );
  }

  const relacionados = produtos
    .filter((p) => p.cat === produto.cat && p.id !== produto.id)
    .slice(0, 4);

  const adicionarAoCarrinho = () => {
    adicionar(produto.id);
    if (qtd > 1) mudarQtd(produto.id, qtd - 1);
    mostrarToast("Adicionado ao carrinho!");
    abrirCarrinho();
  };

  return (
    <>
      <div className="mx-auto max-w-conteudo px-5 pt-[18px] text-[0.82rem] text-roxo-escuro">
        <Link to="/" className="hover:underline">
          Início
        </Link>{" "}
        <span className="text-cinza">&gt;</span>{" "}
        <Link
          to={`/catalogo?categoria=${encodeURIComponent(produto.cat)}`}
          className="hover:underline"
        >
          {produto.cat}
        </Link>{" "}
        <span className="text-cinza">&gt;</span>{" "}
        <span className="text-cinza">{produto.nome}</span>
      </div>

      <div className="mx-auto grid max-w-conteudo grid-cols-1 gap-8 px-5 py-6 md:grid-cols-2">
        {/* imagem */}
        <div className="relative overflow-hidden rounded-xl2 border border-borda bg-white shadow-marca">
          <div className="aspect-square">
            <CakePlaceholder produto={produto} />
          </div>
          <div className="absolute right-4 top-4 grid h-16 w-16 -rotate-[8deg] place-items-center rounded-full bg-white text-center font-titulo text-[0.6rem] font-extrabold leading-[1.05] text-roxo-escuro shadow-marca">
            TOPO
            <br />
            DE
            <br />
            BOLO
          </div>
        </div>

        {/* infos */}
        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full bg-roxo-claro px-3 py-1 font-titulo text-xs font-bold text-roxo-escuro">
            {produto.cat}
          </span>
          <h1 className="text-3xl font-extrabold leading-tight">
            {produto.nome}
          </h1>
          <div className="text-4xl font-extrabold text-roxo-escuro">
            {brl(produto.preco)}{" "}
            <span className="text-sm font-semibold text-cinza">no Studio</span>
          </div>
          <p className="text-[0.95rem] leading-relaxed text-cinza">
            {produto.descricao ??
              "Arquivo digital em alta resolução, pronto para imprimir e montar. Inclui o arquivo Studio para máquina de corte. Após a confirmação do pagamento, o download é liberado. Dúvidas sobre formatos (PDF para corte com tesoura) podem ser tiradas pelo WhatsApp."}
          </p>

          {/* quantidade */}
          <div className="flex items-center gap-3">
            <span className="font-titulo text-sm font-bold">Quantidade</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQtd((q) => Math.max(1, q - 1))}
                aria-label="Diminuir"
                className="grid h-9 w-9 place-items-center rounded-lg bg-roxo-claro font-extrabold text-roxo-escuro"
              >
                −
              </button>
              <span className="min-w-[28px] text-center font-bold">{qtd}</span>
              <button
                onClick={() => setQtd((q) => q + 1)}
                aria-label="Aumentar"
                className="grid h-9 w-9 place-items-center rounded-lg bg-roxo-claro font-extrabold text-roxo-escuro"
              >
                +
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            full
            onClick={adicionarAoCarrinho}
            className="py-4 text-lg"
            iconRight={<Icon name="cart" size={20} />}
          >
            Adicionar ao carrinho
          </Button>

          <div className="rounded-xl2 border border-borda bg-creme p-4 text-[0.85rem] text-cinza">
            <p>
              <b className="text-roxo-escuro">Arquivo Studio</b> para máquina de
              corte incluso.
            </p>
            <p>
              <b className="text-rosa-escuro">PDF para corte com tesoura</b>{" "}
              apenas via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* relacionados */}
      {relacionados.length > 0 && (
        <section className="mx-auto max-w-conteudo px-5 py-8">
          <h2 className="mb-4 text-2xl font-extrabold">Você também pode gostar</h2>
          <ProductGrid produtos={relacionados} />
        </section>
      )}
    </>
  );
}
