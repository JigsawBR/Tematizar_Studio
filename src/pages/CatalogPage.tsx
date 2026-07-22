import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { produtosFiltrados } from "@/lib/catalog";
import { useUi } from "@/store/ui";
import { useCatalog } from "@/store/catalog";
import Filters from "@/components/catalog/Filters";
import SortBar from "@/components/catalog/SortBar";
import ProductGrid from "@/components/catalog/ProductGrid";

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const { categoria, busca, precoMin, precoMax, ordenar, setCategoria } = useUi();
  const produtos = useCatalog((s) => s.produtos);
  const carregando = useCatalog((s) => s.carregando);

  // sincroniza a categoria vinda da URL (?categoria=Datas) com o filtro
  const categoriaUrl = searchParams.get("categoria");
  useEffect(() => {
    setCategoria(categoriaUrl);
  }, [categoriaUrl, setCategoria]);

  const lista = useMemo(
    () =>
      produtosFiltrados(produtos, {
        categoria,
        busca,
        precoMin,
        precoMax,
        ordenar,
      }),
    [produtos, categoria, busca, precoMin, precoMax, ordenar],
  );

  return (
    <>
      <div className="mx-auto max-w-conteudo px-5 pt-[18px] text-[0.82rem] text-roxo-escuro">
        Início <span className="text-cinza">&gt;</span>{" "}
        {categoria ?? "Topos de Bolo"}
      </div>
      <div className="mx-auto max-w-conteudo px-5 pb-2 pt-1.5">
        <h1 className="mb-1 text-3xl font-extrabold sm:text-4xl">
          {categoria ?? "Topos de Bolo"}
        </h1>
        <p className="max-w-2xl text-[0.92rem] text-cinza">
          Topos digitais para imprimir e montar.{" "}
          <span className="font-bold text-roxo-escuro">
            ✔ Arquivos Studio p/ máquina de corte.
          </span>{" "}
          <span className="font-bold text-rosa-escuro">
            ⚠ PDF p/ corte com tesoura só via WhatsApp.
          </span>
        </p>
      </div>

      <div className="mx-auto grid max-w-conteudo grid-cols-1 items-start gap-6 px-5 py-5 md:grid-cols-[260px_1fr]">
        <Filters />
        <div>
          <SortBar quantidade={lista.length} />
          {carregando ? (
            <div className="py-16 text-center text-cinza">Carregando topos…</div>
          ) : (
            <ProductGrid produtos={lista} />
          )}
        </div>
      </div>
    </>
  );
}
