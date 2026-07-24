import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { produtosFiltrados } from "@/lib/catalog";
import { useUi } from "@/store/ui";
import { useCatalog } from "@/store/catalog";
import Filters from "@/components/catalog/Filters";
import SortBar from "@/components/catalog/SortBar";
import ProductGrid from "@/components/catalog/ProductGrid";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const { categoria, busca, precoMin, precoMax, ordenar, setCategoria } = useUi();
  const produtos = useCatalog((s) => s.produtos);
  const carregando = useCatalog((s) => s.carregando);
  const erro = useCatalog((s) => s.erro);
  const recarregar = useCatalog((s) => s.carregar);
  // Abaixo de lg os filtros ficam recolhidos atrás do botão "Filtrar", para os
  // produtos não nascerem abaixo da dobra.
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

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
            Arquivos Studio p/ máquina de corte.
          </span>{" "}
          <span className="font-bold text-rosa-escuro">
            PDF p/ corte com tesoura só via WhatsApp.
          </span>
        </p>
      </div>

      <div className="mx-auto grid max-w-conteudo grid-cols-1 items-start gap-6 px-5 py-5 lg:grid-cols-[260px_1fr]">
        <div>
          <button
            onClick={() => setFiltrosAbertos((v) => !v)}
            aria-expanded={filtrosAbertos}
            className="mb-3 flex w-full items-center justify-between rounded-xl border-2 border-borda bg-white px-4 py-3 font-titulo font-bold text-roxo-escuro transition hover:border-roxo lg:hidden"
          >
            <span className="flex items-center gap-2">
              Filtrar
              {categoria && (
                <span className="rounded-full bg-roxo-claro px-2.5 py-0.5 text-[0.72rem] font-extrabold">
                  {categoria}
                </span>
              )}
            </span>
            <Icon
              name="chevronDown"
              size={18}
              className={`transition ${filtrosAbertos ? "rotate-180" : ""}`}
            />
          </button>
          <div className={filtrosAbertos ? "" : "hidden lg:block"}>
            <Filters />
          </div>
        </div>
        <div>
          <SortBar quantidade={lista.length} />
          {erro ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-rosa-claro text-rosa-escuro">
                <Icon name="alert" size={28} />
              </span>
              <div className="text-cinza">
                Não conseguimos carregar os topos.
                <br />
                Verifique sua conexão e tente de novo.
              </div>
              <Button variant="outline" onClick={() => recarregar()}>
                Tentar de novo
              </Button>
            </div>
          ) : carregando ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductGrid produtos={lista} />
          )}
        </div>
      </div>
    </>
  );
}
