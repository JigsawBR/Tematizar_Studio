export interface Produto {
  id: number;
  /** identificador estável que casa com o slug no banco (Supabase) */
  slug: string;
  nome: string;
  cat: string;
  preco: number;
  /** cor base do placeholder */
  c1: string;
  /** cor secundária do placeholder */
  c2: string;
  /** emoji do topo no placeholder */
  topo: string;
  /** descrição exibida na página do produto (opcional) */
  descricao?: string;
  /** caminho para foto real (opcional) — quando presente, substitui o placeholder */
  img?: string;
}

export interface ItemCarrinho {
  id: number;
  qtd: number;
}

export type Ordenacao = "destaque" | "menor" | "maior" | "az";
