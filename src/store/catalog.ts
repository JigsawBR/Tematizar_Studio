import { create } from "zustand";
import type { Produto } from "@/types";
import { supabase } from "@/lib/supabase";

// Catálogo vem do banco (tabela `produtos` + `categorias`). É a fonte única:
// o painel admin edita o banco e chama `carregar()` para a vitrine refletir.

interface CatalogState {
  produtos: Produto[];
  categorias: string[];
  carregando: boolean;
  erro: boolean;
  carregar: () => Promise<void>;
}

interface LinhaProduto {
  numero: number;
  slug: string;
  nome: string;
  preco_centavos: number;
  descricao: string | null;
  emoji: string | null;
  cor_primaria: string | null;
  cor_secundaria: string | null;
  imagem_url: string | null;
  categorias: { nome: string } | null;
}

// Linha do banco -> formato usado na vitrine (mesmo shape do antigo estático).
function mapear(r: LinhaProduto): Produto {
  return {
    id: r.numero,
    slug: r.slug,
    nome: r.nome,
    cat: r.categorias?.nome ?? "",
    preco: r.preco_centavos / 100,
    c1: r.cor_primaria ?? "#e9d5ff",
    c2: r.cor_secundaria ?? "#a78bfa",
    topo: r.emoji ?? "🎂",
    descricao: r.descricao ?? undefined,
    img: r.imagem_url ?? undefined,
  };
}

export const useCatalog = create<CatalogState>((set) => ({
  produtos: [],
  categorias: [],
  carregando: true,
  erro: false,

  carregar: async () => {
    set({ carregando: true, erro: false });
    try {
      const [prod, cat] = await Promise.all([
        supabase
          .from("produtos")
          .select(
            "numero, slug, nome, preco_centavos, descricao, emoji, cor_primaria, cor_secundaria, imagem_url, categorias(nome)",
          )
          .eq("ativo", true)
          // "destaque" (padrão): os em destaque primeiro, depois pela ordem estável.
          .order("destaque", { ascending: false })
          .order("numero", { ascending: true }),
        supabase
          .from("categorias")
          .select("nome, ordem")
          .order("ordem", { ascending: true }),
      ]);

      if (prod.error || cat.error) throw prod.error ?? cat.error;

      const linhas = (prod.data as unknown as LinhaProduto[] | null) ?? [];
      const cats = (cat.data as { nome: string }[] | null) ?? [];
      set({
        produtos: linhas.map(mapear),
        categorias: cats.map((c) => c.nome),
        carregando: false,
        erro: false,
      });
    } catch {
      set({ carregando: false, erro: true });
    }
  },
}));

// Carrega o catálogo assim que a aplicação inicia.
void useCatalog.getState().carregar();
