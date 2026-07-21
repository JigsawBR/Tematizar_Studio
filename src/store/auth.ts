import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  session: Session | null;
  user: User | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<{ erro?: string }>;
  cadastrar: (
    email: string,
    senha: string,
    nome: string,
    telefone: string,
  ) => Promise<{ erro?: string; precisaConfirmar?: boolean }>;
  sair: () => Promise<void>;
}

export const useAuth = create<AuthState>(() => ({
  session: null,
  user: null,
  carregando: true,

  entrar: async (email, senha) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) return { erro: traduzErro(error.message) };
    return {};
  },

  cadastrar: async (email, senha, nome, telefone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome, telefone } },
    });
    if (error) return { erro: traduzErro(error.message) };
    // Se confirmação de e-mail estiver ligada, não há sessão ainda.
    const precisaConfirmar = !data.session;
    return { precisaConfirmar };
  },

  sair: async () => {
    await supabase.auth.signOut();
  },
}));

// Mantém o store sincronizado com o Supabase (login, logout, refresh de token).
supabase.auth.getSession().then(({ data }) => {
  useAuth.setState({
    session: data.session,
    user: data.session?.user ?? null,
    carregando: false,
  });
});

supabase.auth.onAuthStateChange((_event, session) => {
  useAuth.setState({
    session,
    user: session?.user ?? null,
    carregando: false,
  });
});

function traduzErro(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Este e-mail já está cadastrado.";
  if (m.includes("password should be"))
    return "A senha precisa ter pelo menos 6 caracteres.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "E-mail inválido.";
  return "Não foi possível concluir. Tente novamente.";
}
