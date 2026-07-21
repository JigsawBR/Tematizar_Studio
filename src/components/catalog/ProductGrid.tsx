import type { Produto } from "@/types";
import ProductCard from "@/components/catalog/ProductCard";

interface Props {
  produtos: Produto[];
}

export default function ProductGrid({ produtos }: Props) {
  if (produtos.length === 0) {
    return (
      <div className="py-16 text-center text-cinza">
        <span className="mb-2.5 block text-5xl">🎈</span>
        Nenhum topo encontrado com esses filtros.
        <br />
        Tente outra busca ou categoria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-5">
      {produtos.map((p) => (
        <ProductCard key={p.id} produto={p} />
      ))}
    </div>
  );
}
