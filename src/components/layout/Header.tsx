import { Link, useNavigate } from "react-router-dom";
import { useUi } from "@/store/ui";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { WHATSAPP } from "@/config";

export default function Header() {
  const { busca, setBusca, abrirCarrinho } = useUi();
  const totalItens = useCart((s) => s.itens.reduce((soma, i) => soma + i.qtd, 0));
  const user = useAuth((s) => s.user);
  const ehAdmin = useAuth((s) => s.ehAdmin);
  const sair = useAuth((s) => s.sair);
  const mostrarToast = useUi((s) => s.mostrarToast);
  const navigate = useNavigate();

  // Login por e-mail salva "nome"; login pelo Google traz "full_name"/"name".
  const nomeCompleto =
    (user?.user_metadata?.nome as string | undefined) ??
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined);
  const primeiroNome =
    nomeCompleto?.split(" ")[0] ?? user?.email?.split("@")[0];

  const onSair = async () => {
    await sair();
    mostrarToast("Você saiu da conta. Até logo! 👋");
    navigate("/");
  };

  const onBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/catalogo");
  };

  return (
    <header className="border-b border-borda bg-white">
      <div className="mx-auto flex max-w-conteudo flex-wrap items-center gap-5 px-5 py-4">
        {/* marca */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <img
            src="/logo.jpeg"
            alt="Tematizar Studio"
            className="h-12 w-12 rounded-full object-cover shadow-marca"
          />
          <span className="font-marca text-lg font-bold leading-tight text-roxo-escuro">
            Tematizar Studio
            <small className="block font-corpo text-[0.6rem] font-semibold tracking-[0.14em] text-cinza">
              ARQUIVOS DIGITAIS
            </small>
          </span>
        </Link>

        {/* busca */}
        <form
          className="relative order-3 flex-[1_1_100%] sm:order-none sm:flex-1"
          onSubmit={onBuscar}
          role="search"
        >
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="O que você está buscando?"
            aria-label="Buscar produtos"
            className="w-full rounded-[40px] border-2 border-borda bg-creme py-3.5 pl-5 pr-12 font-corpo text-[0.95rem] transition focus:border-roxo focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-roxo text-white"
          >
            🔍
          </button>
        </form>

        {/* ações */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2 whitespace-nowrap text-[0.82rem]">
              <Link
                to="/conta"
                aria-label="Minha conta"
                title="Minha conta"
                className="text-2xl"
              >
                👤
              </Link>
              <span className="hidden md:block">
                <b className="block font-extrabold">Olá, {primeiroNome}</b>
                <span className="flex items-center gap-2">
                  {ehAdmin && (
                    <>
                      <Link
                        to="/admin"
                        className="font-bold text-roxo-escuro transition hover:text-roxo"
                      >
                        Admin
                      </Link>
                      <span className="text-borda">·</span>
                    </>
                  )}
                  <button
                    onClick={onSair}
                    className="text-cinza transition hover:text-rosa-escuro"
                  >
                    Sair
                  </button>
                </span>
              </span>
            </div>
          ) : (
            <Link
              to="/entrar"
              aria-label="Entrar ou cadastrar"
              title="Entrar ou cadastrar"
              className="flex items-center gap-2 whitespace-nowrap text-[0.82rem]"
            >
              <span className="text-2xl">👤</span>
              <span className="hidden md:block">
                <b className="block font-extrabold">Olá! Faça login</b>
                <span className="text-cinza">ou cadastre-se</span>
              </span>
            </Link>
          )}
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fale conosco no WhatsApp"
            title="Fale conosco no WhatsApp"
            className="text-2xl"
          >
            💬
          </a>
          <button
            onClick={abrirCarrinho}
            aria-label="Abrir carrinho"
            className="relative text-2xl text-roxo"
          >
            🛒
            <span className="absolute -right-2 -top-1.5 grid h-[19px] min-w-[19px] place-items-center rounded-[10px] bg-rosa px-1 font-titulo text-[0.7rem] font-extrabold text-white">
              {totalItens}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
