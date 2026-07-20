import type { Produto, Ordenacao } from "../types";

export interface FiltrosCatalogo {
  categoria: string | null;
  busca: string;
  precoMin: string;
  precoMax: string;
  ordenar: Ordenacao;
}

export function produtosFiltrados(
  produtos: Produto[],
  f: FiltrosCatalogo,
): Produto[] {
  let lista = produtos.slice();

  if (f.categoria) lista = lista.filter((p) => p.cat === f.categoria);

  if (f.busca.trim()) {
    const t = f.busca.trim().toLowerCase();
    lista = lista.filter(
      (p) =>
        p.nome.toLowerCase().includes(t) || p.cat.toLowerCase().includes(t),
    );
  }

  const min = parseFloat(f.precoMin);
  const max = parseFloat(f.precoMax);
  if (!isNaN(min)) lista = lista.filter((p) => p.preco >= min);
  if (!isNaN(max)) lista = lista.filter((p) => p.preco <= max);

  if (f.ordenar === "menor") lista.sort((a, b) => a.preco - b.preco);
  if (f.ordenar === "maior") lista.sort((a, b) => b.preco - a.preco);
  if (f.ordenar === "az") lista.sort((a, b) => a.nome.localeCompare(b.nome));

  return lista;
}
