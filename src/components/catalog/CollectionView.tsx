import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PRODUTOS } from "@/data/products";
import { useUi } from "@/store/ui";
import SortBar from "@/components/catalog/SortBar";
import ProductGrid from "@/components/catalog/ProductGrid";

interface Props {
  titulo: string;
  subtitulo: string;
  categorias: string[];
}

export default function CollectionView({ titulo, subtitulo, categorias }: Props) {
  const ordenar = useUi((s) => s.ordenar);

  const lista = useMemo(() => {
    const l = PRODUTOS.filter((p) => categorias.includes(p.cat));
    if (ordenar === "menor") l.sort((a, b) => a.preco - b.preco);
    if (ordenar === "maior") l.sort((a, b) => b.preco - a.preco);
    if (ordenar === "az") l.sort((a, b) => a.nome.localeCompare(b.nome));
    return l;
  }, [categorias, ordenar]);

  return (
    <>
      <div className="mx-auto max-w-conteudo px-5 pt-[18px] text-[0.82rem] text-roxo-escuro">
        <Link to="/" className="hover:underline">
          Início
        </Link>{" "}
        <span className="text-cinza">&gt;</span> {titulo}
      </div>
      <div className="mx-auto max-w-conteudo px-5 pb-2 pt-1.5">
        <h1 className="mb-1 text-3xl font-extrabold sm:text-4xl">{titulo}</h1>
        <p className="max-w-2xl text-[0.92rem] text-cinza">{subtitulo}</p>
      </div>

      <div className="mx-auto max-w-conteudo px-5 py-5">
        {/* atalhos de categoria */}
        <div className="mb-5 flex flex-wrap gap-2">
          {categorias.map((c) => (
            <Link
              key={c}
              to={`/catalogo?categoria=${encodeURIComponent(c)}`}
              className="rounded-full bg-roxo-claro px-4 py-2 font-titulo text-sm font-bold text-roxo-escuro transition hover:bg-roxo hover:text-white"
            >
              {c}
            </Link>
          ))}
        </div>

        <SortBar quantidade={lista.length} />
        <ProductGrid produtos={lista} />
      </div>
    </>
  );
}
