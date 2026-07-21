import { WHATSAPP } from "@/config";

const CANAIS = [
  {
    emoji: "💬",
    titulo: "WhatsApp",
    texto: "Atendimento e pedidos",
    href: `https://wa.me/${WHATSAPP}`,
    acao: "Chamar no WhatsApp",
  },
  {
    emoji: "📷",
    titulo: "Instagram",
    texto: "@tematizarstudio",
    href: "https://instagram.com",
    acao: "Ver perfil",
  },
  {
    emoji: "✉",
    titulo: "E-mail",
    texto: "contato@tematizarstudio.com",
    href: "mailto:contato@tematizarstudio.com",
    acao: "Enviar e-mail",
  },
];

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-conteudo px-5 py-10">
      <h1 className="mb-2 text-3xl font-extrabold sm:text-4xl">Contato</h1>
      <p className="mb-8 max-w-2xl text-cinza">
        Fale com a Tematizar Studio pelo canal que preferir. Respondemos o mais
        rápido possível!
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {CANAIS.map((c) => (
          <a
            key={c.titulo}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-xl2 border border-borda bg-white p-6 text-center shadow-marca transition hover:-translate-y-1 hover:shadow-marca-hover"
          >
            <span className="text-4xl">{c.emoji}</span>
            <h3 className="font-titulo text-lg font-bold text-roxo-escuro">
              {c.titulo}
            </h3>
            <p className="text-[0.88rem] text-cinza">{c.texto}</p>
            <span className="mt-2 rounded-lg bg-roxo px-4 py-2 font-titulo text-sm font-bold text-white">
              {c.acao}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
