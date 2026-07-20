import { create } from "zustand";
import type { Ordenacao } from "../types";

interface UiState {
  // carrinho (drawer)
  carrinhoAberto: boolean;
  abrirCarrinho: () => void;
  fecharCarrinho: () => void;

  // toast
  toast: string | null;
  mostrarToast: (msg: string) => void;

  // filtros do catálogo
  categoria: string | null;
  busca: string;
  precoMin: string;
  precoMax: string;
  ordenar: Ordenacao;
  setCategoria: (c: string | null) => void;
  setBusca: (b: string) => void;
  setPrecoMin: (v: string) => void;
  setPrecoMax: (v: string) => void;
  setOrdenar: (o: Ordenacao) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useUi = create<UiState>((set) => ({
  carrinhoAberto: false,
  abrirCarrinho: () => set({ carrinhoAberto: true }),
  fecharCarrinho: () => set({ carrinhoAberto: false }),

  toast: null,
  mostrarToast: (msg) => {
    set({ toast: msg });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), 2200);
  },

  categoria: null,
  busca: "",
  precoMin: "",
  precoMax: "",
  ordenar: "destaque",
  setCategoria: (categoria) => set({ categoria }),
  setBusca: (busca) => set({ busca }),
  setPrecoMin: (precoMin) => set({ precoMin }),
  setPrecoMax: (precoMax) => set({ precoMax }),
  setOrdenar: (ordenar) => set({ ordenar }),
}));
