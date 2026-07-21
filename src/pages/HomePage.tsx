import { Link } from "react-router-dom";
import { PRODUTOS } from "@/data/products";
import ProductGrid from "@/components/catalog/ProductGrid";

const CATEGORIAS_DESTAQUE: { nome: string; emoji: string }[] = [
  { nome: "Meninas", emoji: "🦄" },
  { nome: "Meninos", emoji: "🚀" },
  { nome: "Chá de Bebê", emoji: "🧸" },
  { nome: "Páscoa", emoji: "🐰" },
  { nome: "Formatura", emoji: "🎓" },
  { nome: "Datas", emoji: "🎄" },
];

const BENEFICIOS = [
  { emoji: "⚡", titulo: "Download imediato", texto: "Receba o arquivo assim que o pagamento for confirmado." },
  { emoji: "✂️", titulo: "Pronto p/ máquina de corte", texto: "Arquivos Studio prontos para Silhouette e similares." },
  { emoji: "💬", titulo: "Suporte no WhatsApp", texto: "Tire dúvidas e finalize seu pedido pelo WhatsApp." },
];

export default function HomePage() {
  const destaques = PRODUTOS.slice(0, 8);

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-br from-roxo via-roxo-escuro to-rosa text-white">
        <div className="mx-auto flex max-w-conteudo flex-col items-center gap-6 px-5 py-16 text-center">
          <img
            src="/logo.jpeg"
            alt="Tematizar Studio"
            className="h-24 w-24 rounded-full object-cover shadow-marca ring-4 ring-white/40"
          />
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
            Topos de bolo digitais para deixar sua festa linda
          </h1>
          <p className="max-w-xl text-[1.05rem] opacity-90">
            Arquivos prontos para imprimir e montar. Escolha, baixe e monte —
            simples assim.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/catalogo"
              className="rounded-2xl bg-white px-7 py-3.5 font-titulo text-[1.05rem] font-bold text-roxo-escuro shadow-marca transition hover:bg-creme"
            >
              Ver todos os topos 🎂
            </Link>
            <Link
              to="/como-baixar"
              className="rounded-2xl border-2 border-white/70 px-7 py-3.5 font-titulo text-[1.05rem] font-bold text-white transition hover:bg-white/15"
            >
              Como baixar
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="mx-auto grid max-w-conteudo grid-cols-1 gap-4 px-5 py-10 sm:grid-cols-3">
        {BENEFICIOS.map((b) => (
          <div
            key={b.titulo}
            className="flex items-start gap-3 rounded-xl2 border border-borda bg-white p-4 shadow-marca"
          >
            <span className="text-3xl">{b.emoji}</span>
            <div>
              <h3 className="font-titulo text-base font-bold text-roxo-escuro">
                {b.titulo}
              </h3>
              <p className="text-[0.85rem] text-cinza">{b.texto}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-conteudo px-5 py-6">
        <h2 className="mb-4 text-2xl font-extrabold">Escolha por tema</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIAS_DESTAQUE.map((c) => (
            <Link
              key={c.nome}
              to={`/catalogo?categoria=${encodeURIComponent(c.nome)}`}
              className="flex flex-col items-center gap-2 rounded-xl2 border border-borda bg-roxo-claro p-5 text-center shadow-marca transition hover:-translate-y-1 hover:shadow-marca-hover"
            >
              <span className="text-4xl">{c.emoji}</span>
              <span className="font-titulo text-[0.9rem] font-bold text-roxo-escuro">
                {c.nome}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-conteudo px-5 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">Mais queridinhos</h2>
          <Link
            to="/catalogo"
            className="font-titulo text-sm font-bold text-roxo-escuro hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        <ProductGrid produtos={destaques} />
      </section>
    </>
  );
}
