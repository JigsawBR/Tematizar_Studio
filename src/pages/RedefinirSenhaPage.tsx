import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useUi } from "@/store/ui";

export default function RedefinirSenhaPage() {
  const navigate = useNavigate();
  const { user, carregando, redefinirSenha } = useAuth();
  const mostrarToast = useUi((s) => s.mostrarToast);

  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    if (senha.length < 6) return setErro("A senha precisa ter pelo menos 6 caracteres.");
    if (senha !== confirma) return setErro("As senhas não conferem.");

    setEnviando(true);
    const { erro } = await redefinirSenha(senha);
    setEnviando(false);
    if (erro) return setErro(erro);
    mostrarToast("Senha atualizada! 🎉");
    navigate("/downloads");
  };

  return (
    <div className="mx-auto max-w-md px-5 py-12">
      <div className="rounded-xl2 border border-borda bg-white p-8 shadow-marca">
        <h1 className="mb-1 text-2xl font-extrabold text-roxo-escuro">
          Definir nova senha
        </h1>

        {carregando ? (
          <p className="mt-4 text-[0.9rem] text-cinza">Carregando...</p>
        ) : !user ? (
          <>
            <p className="mb-6 mt-2 text-[0.9rem] text-cinza">
              Este link é inválido ou expirou. Peça um novo e-mail de
              recuperação para continuar.
            </p>
            <Link
              to="/entrar"
              className="block w-full rounded-xl bg-roxo py-3.5 text-center font-titulo font-bold text-white transition hover:bg-roxo-escuro"
            >
              Voltar ao login
            </Link>
          </>
        ) : (
          <>
            <p className="mb-6 mt-1 text-[0.9rem] text-cinza">
              Crie uma nova senha para a sua conta.
            </p>
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <Campo
                label="Nova senha"
                value={senha}
                onChange={setSenha}
                placeholder="Mínimo 6 caracteres"
              />
              <Campo
                label="Confirmar nova senha"
                value={confirma}
                onChange={setConfirma}
                placeholder="Repita a senha"
              />
              {erro && (
                <div className="rounded-lg bg-rosa-claro px-3 py-2 text-[0.85rem] font-bold text-rosa-escuro">
                  {erro}
                </div>
              )}
              <button
                type="submit"
                disabled={enviando}
                className="mt-2 rounded-xl bg-roxo py-3.5 font-titulo font-bold text-white transition hover:bg-roxo-escuro disabled:opacity-60"
              >
                {enviando ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.8rem] font-bold text-ameixa">{label}</span>
      <input
        type="password"
        value={value}
        required
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-2 border-borda bg-creme px-4 py-3 font-corpo transition focus:border-roxo focus:bg-white focus:outline-none"
      />
    </label>
  );
}
