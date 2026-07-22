import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
  sincronizarUsuario: (userId: string | null) => void;
}

// Cada conta tem seu próprio carrinho. Guardamos o "dono" atual e o usamos como
// sufixo da chave no localStorage, para não misturar carrinhos entre logins no
// mesmo navegador. Visitante sem login = "anon".
let dono = "anon";
let iniciado = false; // primeira sincronização já aconteceu?
const CHAVE = "tematizar-carrinho";

const storagePorUsuario = createJSONStorage(() => ({
  getItem: (name: string) => localStorage.getItem(`${name}:${dono}`),
  setItem: (name: string, value: string) =>
    localStorage.setItem(`${name}:${dono}`, value),
  removeItem: (name: string) => localStorage.removeItem(`${name}:${dono}`),
}));

// Lê o carrinho de um dono direto do localStorage (síncrono e determinístico).
// Usamos leitura própria em vez de persist.rehydrate() para não competir com a
// hidratação automática do middleware (que causava corrida ao trocar de conta).
function lerCarrinho(d: string): Pick<CartState, "itens" | "cupom" | "desconto"> {
  const vazio = { itens: [] as ItemCarrinho[], cupom: "", desconto: 0 };
  try {
    const raw = localStorage.getItem(`${CHAVE}:${d}`);
    if (!raw) return vazio;
    const st = JSON.parse(raw).state ?? {};
    return {
      itens: st.itens ?? [],
      cupom: st.cupom ?? "",
      desconto: st.desconto ?? 0,
    };
  } catch {
    return vazio;
  }
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

      // Troca o carrinho ativo conforme quem está logado. Chamado pelo store de
      // auth a cada mudança de sessão (carga inicial, login, logout, troca de conta).
      sincronizarUsuario: (userId) => {
        const novoDono = userId ?? "anon";
        // Já sincronizado e mesma conta (ex.: refresh de token): nada muda.
        if (iniciado && novoDono === dono) return;

        const eraAnon = dono === "anon";
        // Lê do disco: após um reload (ex.: retorno do OAuth) o carrinho anônimo
        // está no localStorage mas ainda não na memória (skipHydration).
        const itensAnon = eraAnon ? lerCarrinho("anon").itens : [];
        iniciado = true;
        dono = novoDono;

        const alvo = lerCarrinho(novoDono);

        // Ao entrar a partir de uma navegação anônima, leva os itens do
        // visitante para dentro da conta (soma quantidades) e esvazia o
        // carrinho anônimo.
        if (eraAnon && novoDono !== "anon" && itensAnon.length) {
          for (const it of itensAnon) {
            const i = alvo.itens.findIndex((x) => x.id === it.id);
            if (i >= 0)
              alvo.itens[i] = { ...alvo.itens[i], qtd: alvo.itens[i].qtd + it.qtd };
            else alvo.itens.push({ ...it });
          }
          localStorage.removeItem(`${CHAVE}:anon`);
        }

        set(alvo);
      },
    }),
    {
      name: CHAVE,
      storage: storagePorUsuario,
      // Não hidrata sozinho: quem carrega o carrinho é sincronizarUsuario, que
      // sabe o dono certo. Evita a corrida entre hidratação automática e troca
      // de conta.
      skipHydration: true,
      partialize: (s) => ({ itens: s.itens, cupom: s.cupom, desconto: s.desconto }),
    },
  ),
);
