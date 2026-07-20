import { useMemo } from "react";
import { PRODUTOS } from "../data/products";
import { produtosFiltrados } from "../lib/catalog";
import { useUi } from "../store/ui";
import ProductCard from "./ProductCard";
import SortBar from "./SortBar";

export default function ProductGrid() {
  const { categoria, busca, precoMin, precoMax, ordenar } = useUi();

  const lista = useMemo(
    () =>
      produtosFiltrados(PRODUTOS, {
        categoria,
        busca,
        precoMin,
        precoMax,
        ordenar,
      }),
    [categoria, busca, precoMin, precoMax, ordenar],
  );

  return (
    <main>
      <SortBar quantidade={lista.length} />
      {lista.length === 0 ? (
        <div className="py-16 text-center text-cinza">
          <span className="mb-2.5 block text-5xl">🎈</span>
          Nenhum topo encontrado com esses filtros.
          <br />
          Tente outra busca ou categoria.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-5">
          {lista.map((p) => (
            <ProductCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </main>
  );
}
