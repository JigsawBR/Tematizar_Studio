import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ItemCarrinho } from "../types";
import { CUPONS } from "../config";

interface CartState {
  itens: ItemCarrinho[];
  cupom: string;
  desconto: number; // fração aplicada (0.10 = 10%)
  adicionar: (id: number) => void;
  mudarQtd: (id: number, delta: number) => void;
  remover: (id: number) => void;
  aplicarCupom: (codigo: string) => boolean;
  limpar: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      itens: [],
      cupom: "",
      desconto: 0,

      adicionar: (id) => {
        const itens = get().itens;
        const existente = itens.find((i) => i.id === id);
        if (existente) {
          set({
            itens: itens.map((i) =>
              i.id === id ? { ...i, qtd: i.qtd + 1 } : i,
            ),
          });
        } else {
          set({ itens: [...itens, { id, qtd: 1 }] });
        }
      },

      mudarQtd: (id, delta) => {
        const itens = get()
          .itens.map((i) => (i.id === id ? { ...i, qtd: i.qtd + delta } : i))
          .filter((i) => i.qtd > 0);
        set({ itens });
      },

      remover: (id) =>
        set({ itens: get().itens.filter((i) => i.id !== id) }),

      aplicarCupom: (codigo) => {
        const cod = codigo.trim().toUpperCase();
        const fracao = CUPONS[cod];
        if (fracao !== undefined) {
          set({ cupom: cod, desconto: fracao });
          return true;
        }
        set({ cupom: "", desconto: 0 });
        return false;
      },

      limpar: () => set({ itens: [], cupom: "", desconto: 0 }),
    }),
    {
      name: "tematizar-carrinho",
      partialize: (s) => ({ itens: s.itens, cupom: s.cupom, desconto: s.desconto }),
    },
  ),
);
