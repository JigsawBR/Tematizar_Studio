import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/store/cart";

interface AuthState {
  session: Session | null;
  user: User | null;
  carregando: boolean;
  ehAdmin: boolean;
  entrar: (email: string, senha: string) => Promise<{ erro?: string }>;
  cadastrar: (
    email: string,
    senha: string,
    nome: string,
    telefone: string,
  ) => Promise<{ erro?: string; precisaConfirmar?: boolean }>;
  entrarComGoogle: (redirect?: string) => Promise<{ erro?: string }>;
  recuperarSenha: (email: string) => Promise<{ erro?: string }>;
  redefinirSenha: (novaSenha: string) => Promise<{ erro?: string }>;
  atualizarPerfil: (
    nome: string,
    telefone: string,
  ) => Promise<{ erro?: string }>;
  sair: () => Promise<void>;
}

export const useAuth = create<AuthState>((_set, get) => ({
  session: null,
  user: null,
  carregando: true,
  ehAdmin: false,

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

  // Login social. Redireciona para o Google e, no retorno, o Supabase
  // cria/atualiza a conta (já verificada) e manda de volta para `redirect`.
  entrarComGoogle: async (redirect = "/downloads") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${redirect}` },
    });
    if (error) return { erro: traduzErro(error.message) };
    return {};
  },

  // Envia o e-mail com o link de recuperação. O link volta para
  // /redefinir-senha, onde o usuário define a nova senha.
  recuperarSenha: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    if (error) return { erro: traduzErro(error.message) };
    return {};
  },

  // Define a nova senha. Funciona tanto no fluxo de recuperação (sessão
  // temporária vinda do link) quanto para um usuário logado que troca a senha.
  redefinirSenha: async (novaSenha) => {
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) return { erro: traduzErro(error.message) };
    return {};
  },

  // Atualiza nome/telefone no user_metadata (usado no cabeçalho) e na tabela
  // perfis (fonte para entrega/relatórios).
  atualizarPerfil: async (nome, telefone) => {
    const { error: erroMeta } = await supabase.auth.updateUser({
      data: { nome, telefone },
    });
    const uid = get().user?.id;
    let erroPerfil = null;
    if (uid) {
      const { error } = await supabase
        .from("perfis")
        .update({ nome, telefone })
        .eq("id", uid);
      erroPerfil = error;
    }
    if (erroMeta || erroPerfil)
      return { erro: "Não foi possível salvar. Tente novamente." };
    return {};
  },

  sair: async () => {
    await supabase.auth.signOut();
  },
}));

// Descobre se o usuário logado é admin (função is_admin() no banco).
async function checarAdmin(user: User | null) {
  if (!user) return useAuth.setState({ ehAdmin: false });
  const { data } = await supabase.rpc("is_admin");
  useAuth.setState({ ehAdmin: data === true });
}

// Mantém o store sincronizado com o Supabase (login, logout, refresh de token).
// Em cada mudança, aponta o carrinho para o dono certo (cada conta tem o seu).
supabase.auth.getSession().then(({ data }) => {
  useCart.getState().sincronizarUsuario(data.session?.user?.id ?? null);
  useAuth.setState({
    session: data.session,
    user: data.session?.user ?? null,
    carregando: false,
  });
  void checarAdmin(data.session?.user ?? null);
});

supabase.auth.onAuthStateChange((_event, session) => {
  useCart.getState().sincronizarUsuario(session?.user?.id ?? null);
  useAuth.setState({
    session,
    user: session?.user ?? null,
    carregando: false,
  });
  void checarAdmin(session?.user ?? null);
});

function traduzErro(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Este e-mail já está cadastrado.";
  if (m.includes("password should be") || m.includes("password should contain"))
    return "A senha precisa ter pelo menos 6 caracteres.";
  if (m.includes("new password should be different"))
    return "A nova senha precisa ser diferente da atual.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "E-mail inválido.";
  if (m.includes("for security purposes") || m.includes("rate limit"))
    return "Muitas tentativas. Aguarde alguns instantes e tente de novo.";
  if (m.includes("auth session missing") || m.includes("session"))
    return "Link expirado ou inválido. Peça um novo e-mail de recuperação.";
  return "Não foi possível concluir. Tente novamente.";
}
