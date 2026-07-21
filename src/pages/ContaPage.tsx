import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useUi } from "@/store/ui";
import { supabase } from "@/lib/supabase";

export default function ContaPage() {
  const navigate = useNavigate();
  const { user, carregando, atualizarPerfil, redefinirSenha, sair } = useAuth();
  const mostrarToast = useUi((s) => s.mostrarToast);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [erroPerfil, setErroPerfil] = useState<string | null>(null);

  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState<string | null>(null);

  // Prefill: tenta a tabela perfis; cai no user_metadata.
  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata ?? {};
    setNome((meta.nome as string) ?? "");
    setTelefone((meta.telefone as string) ?? "");
    supabase
      .from("perfis")
      .select("nome, telefone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.nome) setNome(data.nome);
        if (data?.telefone) setTelefone(data.telefone);
      });
  }, [user]);

  const onSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroPerfil(null);
    setSalvandoPerfil(true);
    const { erro } = await atualizarPerfil(nome, telefone);
    setSalvandoPerfil(false);
    if (erro) return setErroPerfil(erro);
    mostrarToast("Dados salvos! ✅");
  };

  const onSalvarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroSenha(null);
    if (senha.length < 6)
      return setErroSenha("A senha precisa ter pelo menos 6 caracteres.");
    if (senha !== confirma) return setErroSenha("As senhas não conferem.");
    setSalvandoSenha(true);
    const { erro } = await redefinirSenha(senha);
    setSalvandoSenha(false);
    if (erro) return setErroSenha(erro);
    setSenha("");
    setConfirma("");
    mostrarToast("Senha atualizada! 🔒");
  };

  const onSair = async () => {
    await sair();
    mostrarToast("Você saiu da conta. Até logo! 👋");
    navigate("/");
  };

  if (carregando) {
    return (
      <div className="mx-auto max-w-conteudo px-5 py-20 text-center text-cinza">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="rounded-xl2 border border-borda bg-white p-8 text-center shadow-marca">
          <span className="mb-3 block text-5xl">🔒</span>
          <h1 className="mb-2 font-titulo text-xl font-bold text-roxo-escuro">
            Entre na sua conta
          </h1>
          <p className="mb-6 text-[0.9rem] text-cinza">
            Faça login para gerenciar seus dados e sua senha.
          </p>
          <Link
            to="/entrar?redirect=/conta"
            className="block w-full rounded-xl bg-roxo py-3 font-titulo font-bold text-white transition hover:bg-roxo-escuro"
          >
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-10">
      <h1 className="mb-1 text-3xl font-extrabold sm:text-4xl">Minha conta</h1>
      <p className="mb-8 text-cinza">{user.email}</p>

      {/* Dados pessoais */}
      <section className="mb-6 rounded-xl2 border border-borda bg-white p-6 shadow-marca">
        <h2 className="mb-4 font-titulo text-lg font-bold text-roxo-escuro">
          Dados pessoais
        </h2>
        <form onSubmit={onSalvarPerfil} className="flex flex-col gap-3">
          <Campo label="Nome" type="text" value={nome} onChange={setNome} placeholder="Seu nome" />
          <Campo
            label="WhatsApp"
            type="tel"
            value={telefone}
            onChange={setTelefone}
            placeholder="(83) 9 9999-9999"
          />
          {erroPerfil && (
            <div className="rounded-lg bg-rosa-claro px-3 py-2 text-[0.85rem] font-bold text-rosa-escuro">
              {erroPerfil}
            </div>
          )}
          <button
            type="submit"
            disabled={salvandoPerfil}
            className="mt-1 rounded-xl bg-roxo py-3 font-titulo font-bold text-white transition hover:bg-roxo-escuro disabled:opacity-60"
          >
            {salvandoPerfil ? "Salvando..." : "Salvar dados"}
          </button>
        </form>
      </section>

      {/* Trocar senha */}
      <section className="mb-6 rounded-xl2 border border-borda bg-white p-6 shadow-marca">
        <h2 className="mb-4 font-titulo text-lg font-bold text-roxo-escuro">
          Alterar senha
        </h2>
        <form onSubmit={onSalvarSenha} className="flex flex-col gap-3">
          <Campo
            label="Nova senha"
            type="password"
            value={senha}
            onChange={setSenha}
            placeholder="Mínimo 6 caracteres"
          />
          <Campo
            label="Confirmar nova senha"
            type="password"
            value={confirma}
            onChange={setConfirma}
            placeholder="Repita a senha"
          />
          {erroSenha && (
            <div className="rounded-lg bg-rosa-claro px-3 py-2 text-[0.85rem] font-bold text-rosa-escuro">
              {erroSenha}
            </div>
          )}
          <button
            type="submit"
            disabled={salvandoSenha}
            className="mt-1 rounded-xl bg-roxo py-3 font-titulo font-bold text-white transition hover:bg-roxo-escuro disabled:opacity-60"
          >
            {salvandoSenha ? "Salvando..." : "Alterar senha"}
          </button>
        </form>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/downloads"
          className="flex-1 rounded-xl border-2 border-roxo py-3 text-center font-titulo font-bold text-roxo-escuro transition hover:bg-roxo-claro"
        >
          Meus downloads
        </Link>
        <button
          onClick={onSair}
          className="flex-1 rounded-xl border-2 border-borda py-3 font-titulo font-bold text-cinza transition hover:border-rosa hover:text-rosa-escuro"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}

function Campo({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.8rem] font-bold text-ameixa">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-2 border-borda bg-creme px-4 py-3 font-corpo transition focus:border-roxo focus:bg-white focus:outline-none"
      />
    </label>
  );
}
