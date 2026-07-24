import { Link, useLocation } from "react-router-dom";

interface LinkNav {
  label: string;
  to: string;
}

const LINKS: LinkNav[] = [
  { label: "Início", to: "/" },
  { label: "Topos de Bolo", to: "/catalogo" },
  { label: "Festas", to: "/festas" },
  { label: "Datas Comemorativas", to: "/datas-comemorativas" },
  { label: "Kit Digital", to: "/kit-digital" },
  { label: "Downloads", to: "/downloads" },
  { label: "Como Baixar", to: "/como-baixar" },
  { label: "Contato", to: "/contato" },
];

export default function Nav() {
  const location = useLocation();
  const atual = location.pathname + location.search;

  const ehAtivo = (to: string) => {
    if (to === "/") return location.pathname === "/";
    // rota exata (com query) ou mesma rota sem categoria
    if (to.includes("?")) return atual === to;
    return location.pathname === to && !location.search;
  };

  return (
    <nav className="bg-gradient-to-r from-roxo to-roxo-escuro">
      <ul className="mx-auto flex max-w-conteudo flex-nowrap justify-start gap-1.5 overflow-x-auto px-5 lg:flex-wrap lg:justify-center">
        {LINKS.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className={`block whitespace-nowrap rounded-lg px-3.5 py-2.5 font-titulo text-[0.82rem] font-semibold tracking-wide text-white transition hover:bg-white/20 sm:py-3.5 ${
                ehAtivo(l.to) ? "bg-white/20" : ""
              }`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
