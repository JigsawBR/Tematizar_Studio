import { create } from "zustand";
import { supabase } from "@/lib/supabase";

// Perfil do cliente (tabela `perfis`). Usado no onboarding (/bem-vindo) e na
// página da conta. `onboarding_em` marca que a tela de boas-vindas já foi
// concluída ou pulada — para não pedir de novo.
export interface Perfil {
  nome: string;
  telefone: string;
  temas_favoritos: string[];
  onboarding_em: string | null;
}

interface PerfilState {
  perfil: Perfil | null;
  carregando: boolean;
  carregar: (userId: string) => Promise<void>;
  salvar: (dados: {
    nome: string;
    telefone: string;
    temas: string[];
  }) => Promise<{ erro?: string }>;
  encerrarOnboarding: () => Promise<void>;
  limpar: () => void;
}

const VAZIO: Perfil = {
  nome: "",
  telefone: "",
  temas_favoritos: [],
  onboarding_em: null,
};

export const usePerfil = create<PerfilState>((set, get) => ({
  perfil: null,
  carregando: false,

  carregar: async (userId) => {
    set({ carregando: true });
    const { data } = await supabase
      .from("perfis")
      .select("nome, telefone, temas_favoritos, onboarding_em")
      .eq("id", userId)
      .maybeSingle();
    set({
      perfil: data
        ? {
            nome: data.nome ?? "",
            telefone: data.telefone ?? "",
            temas_favoritos: data.temas_favoritos ?? [],
            onboarding_em: data.onboarding_em ?? null,
          }
        : { ...VAZIO },
      carregando: false,
    });
  },

  // Salva o perfil e conclui o onboarding. Também espelha nome/telefone no
  // user_metadata, que é o que o cabeçalho usa para a saudação.
  salvar: async ({ nome, telefone, temas }) => {
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) return { erro: "Sessão expirada. Entre novamente." };

    const agora = new Date().toISOString();
    const { error } = await supabase
      .from("perfis")
      .update({
        nome,
        telefone,
        temas_favoritos: temas,
        onboarding_em: agora,
      })
      .eq("id", uid);
    if (error) return { erro: "Não foi possível salvar. Tente de novo." };

    await supabase.auth.updateUser({ data: { nome, telefone } });
    set({
      perfil: {
        nome,
        telefone,
        temas_favoritos: temas,
        onboarding_em: agora,
      },
    });
    return {};
  },

  // "Agora não": marca como visto para não insistir nas próximas visitas.
  encerrarOnboarding: async () => {
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) return;
    const agora = new Date().toISOString();
    await supabase.from("perfis").update({ onboarding_em: agora }).eq("id", uid);
    const atual = get().perfil ?? VAZIO;
    set({ perfil: { ...atual, onboarding_em: agora } });
  },

  limpar: () => set({ perfil: null, carregando: false }),
}));
