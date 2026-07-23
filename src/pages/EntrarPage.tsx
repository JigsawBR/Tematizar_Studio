import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useUi } from "@/store/ui";

type Aba = "entrar" | "cadastrar";

export default function EntrarPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destino = searchParams.get("redirect") || "/";

  const { entrar, cadastrar, recuperarSenha, entrarComGoogle } = useAuth();
  const mostrarToast = useUi((s) => s.mostrarToast);

  const [aba, setAba] = useState<Aba>("entrar");
  const [recuperar, setRecuperar] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    if (recuperar) {
      const { erro } = await recuperarSenha(email);
      setEnviando(false);
      if (erro) return setErro(erro);
      setEnviado(true);
      return;
    }

    if (aba === "entrar") {
      const { erro } = await entrar(email, senha);
      setEnviando(false);
      if (erro) return setErro(erro);
      mostrarToast("Bem-vindo de volta!");
      navigate(destino);
    } else {
      const { erro, precisaConfirmar } = await cadastrar(
        email,
        senha,
        nome,
        telefone,
      );
      setEnviando(false);
      if (erro) return setErro(erro);
      if (precisaConfirmar) {
        mostrarToast("Confirme seu e-mail para ativar a conta.");
        setAba("entrar");
      } else {
        mostrarToast("Conta criada!");
        navigate(destino);
      }
    }
  };

  const irParaLogin = () => {
    setRecuperar(false);
    setEnviado(false);
    setErro(null);
  };

  const onGoogle = async () => {
    setErro(null);
    setEnviando(true);
    const { erro } = await entrarComGoogle(destino);
    // Se der erro, o navegador não redirecionou; reabilita o botão.
    if (erro) {
      setEnviando(false);
      setErro(erro);
    }
  };

  // ---- Modo recuperação de senha ----
  if (recuperar) {
    return (
      <div className="mx-auto max-w-md px-5 py-12">
        <div className="rounded-xl2 border border-borda bg-white p-8 shadow-marca">
          <h1 className="mb-1 text-2xl font-extrabold text-roxo-escuro">
            Recuperar senha
          </h1>

          {enviado ? (
            <>
              <p className="mb-6 mt-2 text-[0.9rem] text-cinza">
                Se existir uma conta com <b>{email}</b>, enviamos um link para
                redefinir a senha. Confira sua caixa de entrada (e o spam).
              </p>
              <button
                onClick={irParaLogin}
                className="w-full rounded-xl bg-roxo py-3.5 font-titulo font-bold text-white transition hover:bg-roxo-escuro"
              >
                Voltar ao login
              </button>
            </>
          ) : (
            <>
              <p className="mb-6 mt-1 text-[0.9rem] text-cinza">
                Digite seu e-mail e enviaremos um link para você criar uma nova
                senha.
              </p>
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <Campo
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                  placeholder="voce@email.com"
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
                  {enviando ? "Enviando..." : "Enviar link"}
                </button>
              </form>
              <button
                onClick={irParaLogin}
                className="mt-4 w-full text-center text-[0.85rem] font-bold text-roxo-escuro hover:underline"
              >
                ← Voltar ao login
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ---- Modo entrar / cadastrar ----
  return (
    <div className="mx-auto max-w-md px-5 py-12">
      <div className="rounded-xl2 border border-borda bg-white p-8 shadow-marca">
        <div className="mb-6 flex rounded-xl bg-creme p-1">
          <BotaoAba ativo={aba === "entrar"} onClick={() => setAba("entrar")}>
            Entrar
          </BotaoAba>
          <BotaoAba ativo={aba === "cadastrar"} onClick={() => setAba("cadastrar")}>
            Criar conta
          </BotaoAba>
        </div>

        <h1 className="mb-1 text-2xl font-extrabold text-roxo-escuro">
          {aba === "entrar" ? "Entre na sua conta" : "Crie sua conta"}
        </h1>
        <p className="mb-6 text-[0.9rem] text-cinza">
          {aba === "entrar"
            ? "Acesse seus downloads e histórico de compras."
            : "Rápido e grátis. Depois é só comprar e baixar."}
        </p>

        <button
          type="button"
          onClick={onGoogle}
          disabled={enviando}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-borda bg-white py-3 font-titulo font-bold text-ameixa transition hover:bg-creme disabled:opacity-60"
        >
          <GoogleIcon />
          {aba === "entrar" ? "Entrar com Google" : "Cadastrar com Google"}
        </button>

        <div className="my-5 flex items-center gap-3 text-[0.75rem] font-bold text-cinza">
          <span className="h-px flex-1 bg-borda" />
          OU
          <span className="h-px flex-1 bg-borda" />
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          {aba === "cadastrar" && (
            <>
              <Campo
                label="Nome"
                type="text"
                value={nome}
                onChange={setNome}
                required
                placeholder="Seu nome"
              />
              <Campo
                label="WhatsApp"
                type="tel"
                value={telefone}
                onChange={setTelefone}
                placeholder="(83) 9 9999-9999"
              />
            </>
          )}
          <Campo
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
            required
            placeholder="voce@email.com"
          />
          <Campo
            label="Senha"
            type="password"
            value={senha}
            onChange={setSenha}
            required
            placeholder="Mínimo 6 caracteres"
          />

          {aba === "entrar" && (
            <button
              type="button"
              onClick={() => {
                setRecuperar(true);
                setErro(null);
              }}
              className="-mt-1 self-end text-[0.8rem] font-bold text-roxo-escuro hover:underline"
            >
              Esqueci minha senha
            </button>
          )}

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
            {enviando
              ? "Aguarde..."
              : aba === "entrar"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-[0.8rem] text-cinza">
          Ainda não comprou?{" "}
          <Link to="/catalogo" className="font-bold text-roxo-escuro hover:underline">
            Ver catálogo
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

function BotaoAba({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg py-2 font-titulo text-sm font-bold transition ${
        ativo ? "bg-white text-roxo-escuro shadow-marca" : "text-cinza"
      }`}
    >
      {children}
    </button>
  );
}

function Campo({
  label,
  type,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.8rem] font-bold text-ameixa">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-2 border-borda bg-creme px-4 py-3 font-corpo transition focus:border-roxo focus:bg-white focus:outline-none"
      />
    </label>
  );
}
