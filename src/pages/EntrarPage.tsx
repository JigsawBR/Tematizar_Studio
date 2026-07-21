import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useUi } from "@/store/ui";

type Aba = "entrar" | "cadastrar";

export default function EntrarPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destino = searchParams.get("redirect") || "/downloads";

  const { entrar, cadastrar } = useAuth();
  const mostrarToast = useUi((s) => s.mostrarToast);

  const [aba, setAba] = useState<Aba>("entrar");
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

    if (aba === "entrar") {
      const { erro } = await entrar(email, senha);
      setEnviando(false);
      if (erro) return setErro(erro);
      mostrarToast("Bem-vindo de volta! 🎉");
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
        mostrarToast("Confirme seu e-mail para ativar a conta. 📩");
        setAba("entrar");
      } else {
        mostrarToast("Conta criada! 🎉");
        navigate(destino);
      }
    }
  };

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
