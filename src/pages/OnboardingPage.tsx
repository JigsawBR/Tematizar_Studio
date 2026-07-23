import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { usePerfil } from "@/store/perfil";
import { useCatalog } from "@/store/catalog";
import { useUi } from "@/store/ui";
import { mascaraTelefone, apenasDigitos } from "@/lib/telefone";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

// Tela de boas-vindas do primeiro login: completa o perfil (nome + WhatsApp) e
// coleta os temas favoritos. Pode ser pulada — em qualquer caso marcamos
// `onboarding_em` para não pedir de novo.
export default function OnboardingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const destino = params.get("redirect") || "/";

  const user = useAuth((s) => s.user);
  const carregandoAuth = useAuth((s) => s.carregando);
  const perfil = usePerfil((s) => s.perfil);
  const salvarPerfil = usePerfil((s) => s.salvar);
  const encerrar = usePerfil((s) => s.encerrarOnboarding);
  const categorias = useCatalog((s) => s.categorias);
  const mostrarToast = useUi((s) => s.mostrarToast);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [temas, setTemas] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [preenchido, setPreenchido] = useState(false);

  // Prefill: perfil do banco; se vier vazio (login Google), usa o metadata.
  useEffect(() => {
    if (!perfil || preenchido) return;
    const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
    setNome(
      perfil.nome ||
        (meta.full_name as string) ||
        (meta.name as string) ||
        "",
    );
    setTelefone(mascaraTelefone(perfil.telefone));
    setTemas(perfil.temas_favoritos);
    setPreenchido(true);
  }, [perfil, user, preenchido]);

  if (carregandoAuth) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center text-cinza">
        Carregando…
      </div>
    );
  }
  if (!user) return <Navigate to="/entrar?redirect=/bem-vindo" replace />;

  const primeiroNome = (nome || "").trim().split(" ")[0];

  const alternarTema = (c: string) =>
    setTemas((t) => (t.includes(c) ? t.filter((x) => x !== c) : [...t, c]));

  const onSalvar = async () => {
    setErro(null);
    if (!nome.trim()) return setErro("Como podemos te chamar?");
    setSalvando(true);
    const { erro: e } = await salvarPerfil({
      nome: nome.trim(),
      telefone: apenasDigitos(telefone),
      temas,
    });
    setSalvando(false);
    if (e) return setErro(e);
    mostrarToast("Perfil salvo!");
    navigate(destino, { replace: true });
  };

  const onPular = async () => {
    await encerrar();
    navigate(destino, { replace: true });
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-12">
      <div className="rounded-xl2 border border-borda bg-white p-8 shadow-marca">
        <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-roxo-claro text-roxo-escuro">
          <Icon name="user" size={30} />
        </span>

        <h1 className="mb-1 text-center text-2xl font-extrabold text-roxo-escuro">
          Boas-vindas{primeiroNome ? `, ${primeiroNome}` : ""}!
        </h1>
        <p className="mb-7 text-center text-[0.92rem] text-cinza">
          Vamos deixar sua conta pronta — leva menos de um minuto.
        </p>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[0.8rem] font-bold text-ameixa">Nome</span>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              autoComplete="name"
              className="rounded-xl border-2 border-borda bg-creme px-4 py-3 font-corpo transition focus:border-roxo focus:bg-white focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[0.8rem] font-bold text-ameixa">WhatsApp</span>
            <input
              value={telefone}
              onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
              placeholder="(83) 9 9999-9999"
              inputMode="tel"
              autoComplete="tel"
              className="rounded-xl border-2 border-borda bg-creme px-4 py-3 font-corpo transition focus:border-roxo focus:bg-white focus:outline-none"
            />
            <span className="text-[0.75rem] text-cinza">
              Usamos só para falar sobre o seu pedido. Opcional.
            </span>
          </label>

          {categorias.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[0.8rem] font-bold text-ameixa">
                Quais temas você mais procura?
              </span>
              <div className="flex flex-wrap gap-2">
                {categorias.map((c) => {
                  const ativo = temas.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => alternarTema(c)}
                      aria-pressed={ativo}
                      className={`rounded-full px-4 py-2 font-titulo text-sm font-bold transition ${
                        ativo
                          ? "bg-roxo text-white"
                          : "bg-roxo-claro text-roxo-escuro hover:bg-borda"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              <span className="text-[0.75rem] text-cinza">
                Ajuda a te mostrar os topos certos primeiro.
              </span>
            </div>
          )}

          {erro && (
            <div className="rounded-lg bg-rosa-claro px-3 py-2 text-[0.85rem] font-bold text-rosa-escuro">
              {erro}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            full
            disabled={salvando}
            onClick={onSalvar}
            className="mt-1"
          >
            {salvando ? "Salvando..." : "Salvar e continuar"}
          </Button>
          <button
            onClick={onPular}
            className="text-center text-[0.85rem] font-bold text-cinza transition hover:text-roxo-escuro"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
