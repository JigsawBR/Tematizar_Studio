const LINKS = [
  "Início",
  "Topos de Bolo",
  "Festas",
  "Datas Comemorativas",
  "Sublimação",
  "Kit Digitais",
  "Downloads",
  "Como Baixar",
  "Perguntas Frequentes",
  "Contato",
];

export default function Nav() {
  return (
    <nav className="bg-gradient-to-r from-roxo to-roxo-escuro">
      <ul className="mx-auto flex max-w-conteudo flex-nowrap justify-start gap-1.5 overflow-x-auto px-5 sm:flex-wrap sm:justify-center">
        {LINKS.map((label, i) => (
          <li key={label}>
            <a
              href="#"
              className={`block whitespace-nowrap rounded-lg px-3.5 py-3.5 font-titulo text-[0.82rem] font-semibold tracking-wide text-white transition hover:bg-white/20 ${
                i === 1 ? "bg-white/20" : ""
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
