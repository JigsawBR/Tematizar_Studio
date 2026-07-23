import { Link } from "react-router-dom";
import { WHATSAPP } from "@/config";
import Icon from "@/components/ui/Icon";

const KITS = [
  { qtd: 3, desconto: "10% OFF", texto: "Escolha 3 topos e ganhe 10% de desconto." },
  { qtd: 5, desconto: "15% OFF", texto: "Escolha 5 topos e ganhe 15% de desconto." },
  { qtd: 10, desconto: "25% OFF", texto: "Escolha 10 topos e ganhe 25% de desconto." },
];

const PASSOS = [
  { n: 1, texto: "Escolha os temas dos topos que você quer no kit." },
  { n: 2, texto: "Chame no WhatsApp com a sua lista de temas." },
  { n: 3, texto: "A gente monta o kit com o desconto e envia os arquivos." },
];

const msgWhats = encodeURIComponent(
  "Olá! Quero montar um Kit Digital de topos de bolo. Meus temas favoritos são:",
);

export default function KitDigitalPage() {
  return (
    <div className="mx-auto max-w-conteudo px-5 py-10">
      {/* hero */}
      <div className="mb-10 rounded-xl2 bg-gradient-to-br from-roxo via-roxo-escuro to-rosa p-8 text-center text-white sm:p-12">
        <h1 className="mb-2 text-3xl font-extrabold sm:text-4xl">Kit Digital</h1>
        <p className="mx-auto max-w-xl opacity-90">
          Monte um combo com vários topos e economize! Quanto mais temas, maior
          o desconto.
        </p>
      </div>

      {/* kits */}
      <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {KITS.map((k) => (
          <div
            key={k.qtd}
            className="flex flex-col items-center gap-2 rounded-xl2 border border-borda bg-white p-6 text-center shadow-marca"
          >
            <span className="font-titulo text-4xl font-extrabold text-roxo-escuro">
              {k.qtd}
            </span>
            <span className="font-titulo text-sm font-bold text-cinza">
              topos
            </span>
            <span className="rounded-full bg-rosa-claro px-3 py-1 font-titulo text-sm font-extrabold text-rosa-escuro">
              {k.desconto}
            </span>
            <p className="mt-1 text-[0.85rem] text-cinza">{k.texto}</p>
          </div>
        ))}
      </div>

      {/* como funciona */}
      <h2 className="mb-4 text-2xl font-extrabold">Como funciona</h2>
      <ol className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PASSOS.map((p) => (
          <li
            key={p.n}
            className="flex gap-3 rounded-xl2 border border-borda bg-white p-5 shadow-marca"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-roxo font-titulo font-extrabold text-white">
              {p.n}
            </span>
            <p className="text-[0.9rem] text-cinza">{p.texto}</p>
          </li>
        ))}
      </ol>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 rounded-xl2 bg-creme p-8 text-center">
        <p className="font-titulo text-lg font-bold text-roxo-escuro">
          Pronto para montar o seu kit?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${WHATSAPP}?text=${msgWhats}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-7 py-3.5 font-titulo font-bold text-white transition hover:bg-[#1eb355]"
          >
            <Icon name="chat" size={18} /> Montar kit no WhatsApp
          </a>
          <Link
            to="/catalogo"
            className="rounded-2xl border-2 border-roxo px-7 py-3.5 font-titulo font-bold text-roxo-escuro transition hover:bg-roxo-claro"
          >
            Ver todos os topos
          </Link>
        </div>
      </div>
    </div>
  );
}
