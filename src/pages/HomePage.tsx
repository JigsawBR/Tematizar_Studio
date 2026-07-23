import { Link } from "react-router-dom";
import { useCatalog } from "@/store/catalog";
import CakePlaceholder from "@/components/catalog/CakePlaceholder";
import ProductGrid from "@/components/catalog/ProductGrid";
import Icon, { type IconName } from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

const CATEGORIAS_DESTAQUE: { nome: string; icon: IconName }[] = [
  { nome: "Meninas", icon: "crown" },
  { nome: "Meninos", icon: "rocket" },
  { nome: "Chá de Bebê", icon: "baby" },
  { nome: "Páscoa", icon: "egg" },
  { nome: "Formatura", icon: "cap" },
  { nome: "Datas", icon: "gift" },
];

const BENEFICIOS: { icon: IconName; titulo: string; texto: string }[] = [
  { icon: "bolt", titulo: "Download imediato", texto: "Receba o arquivo assim que o pagamento for confirmado." },
  { icon: "scissors", titulo: "Pronto p/ máquina de corte", texto: "Arquivos Studio prontos para Silhouette e similares." },
  { icon: "chat", titulo: "Suporte no WhatsApp", texto: "Tire dúvidas e finalize seu pedido pelo WhatsApp." },
];

// Bolinhas decorativas espalhadas pelo hero (posição/ tamanho/ cor fixos).
const BOLINHAS: React.CSSProperties[] = [
  { top: "14%", left: "6%", width: 12, height: 12, background: "var(--creme, #FBF4E7)" },
  { top: "70%", left: "10%", width: 20, height: 20, background: "#E896BE" },
  { top: "24%", left: "44%", width: 9, height: 9, background: "var(--creme, #FBF4E7)" },
  { top: "80%", left: "38%", width: 13, height: 13, background: "#FBE6F0" },
  { top: "12%", right: "8%", width: 16, height: 16, background: "#FBE6F0" },
  { top: "60%", right: "5%", width: 11, height: 11, background: "var(--creme, #FBF4E7)" },
];

export default function HomePage() {
  const produtos = useCatalog((s) => s.produtos);
  const destaques = produtos.slice(0, 8);
  // Três topos reais para o "colar" flutuante do hero.
  const colar = [produtos[0], produtos[3], produtos[5]];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-roxo via-roxo-escuro to-rosa text-white">
        {BOLINHAS.map((s, i) => (
          <span
            key={i}
            className="pointer-events-none absolute rounded-full opacity-50"
            style={s}
          />
        ))}
        <div className="mx-auto grid max-w-conteudo grid-cols-1 items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-16">
          {/* coluna de texto */}
          <div className="flex flex-col items-start gap-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.18] px-3.5 py-1.5 font-titulo text-[0.78rem] font-bold tracking-wide">
              Arquivos digitais para imprimir e montar
            </span>
            <h1 className="font-titulo text-[clamp(2rem,4.2vw,3.15rem)] font-extrabold leading-[1.08] tracking-tight">
              Topos de bolo digitais para deixar sua festa{" "}
              <span className="text-creme">linda</span>
            </h1>
            <p className="max-w-[460px] text-[1.05rem] leading-relaxed opacity-90">
              Escolha o tema, baixe na hora e monte em casa. Prontos para máquina
              de corte Silhouette.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                to="/catalogo"
                variant="secondary"
                size="lg"
                iconRight={<Icon name="arrow" size={18} />}
              >
                Ver todos os topos
              </Button>
              <Button to="/como-baixar" variant="outline-light" size="lg">
                Como baixar
              </Button>
            </div>
            <div className="mt-1 flex flex-wrap gap-5 font-corpo text-[0.82rem] font-bold">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="check" size={16} /> Download imediato
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="check" size={16} /> Pagamento via PIX
              </span>
            </div>
          </div>

          {/* colar de bolos flutuantes (só no desktop) */}
          <div className="relative hidden h-[320px] md:block">
            {colar[0] && (
              <div className="absolute right-[8%] top-0 h-[190px] w-[190px] -rotate-[5deg] overflow-hidden rounded-xl2 border-4 border-white shadow-marca-hover">
                <CakePlaceholder produto={colar[0]} />
              </div>
            )}
            {colar[1] && (
              <div className="absolute bottom-0 left-[4%] h-[150px] w-[150px] rotate-[6deg] overflow-hidden rounded-xl2 border-4 border-white shadow-marca-hover">
                <CakePlaceholder produto={colar[1]} />
              </div>
            )}
            {colar[2] && (
              <div className="absolute right-[40%] top-[38%] h-[118px] w-[118px] -rotate-2 overflow-hidden rounded-xl border-4 border-white shadow-marca-hover">
                <CakePlaceholder produto={colar[2]} />
              </div>
            )}
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
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-roxo-claro text-roxo-escuro">
              <Icon name={b.icon} size={22} />
            </span>
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
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Escolha por tema</h2>
          <Link
            to="/catalogo"
            className="whitespace-nowrap font-titulo text-sm font-bold text-roxo-escuro hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIAS_DESTAQUE.map((c) => (
            <Link
              key={c.nome}
              to={`/catalogo?categoria=${encodeURIComponent(c.nome)}`}
              className="flex flex-col items-center gap-2.5 rounded-xl2 border border-borda bg-roxo-claro p-5 text-center shadow-marca transition hover:-translate-y-1 hover:shadow-marca-hover"
            >
              <span className="grid h-[54px] w-[54px] place-items-center rounded-full bg-white text-roxo-escuro shadow-marca">
                <Icon name={c.icon} size={26} />
              </span>
              <span className="font-titulo text-[0.9rem] font-bold text-roxo-escuro">
                {c.nome}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-conteudo px-5 py-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Mais queridinhos</h2>
          <Link
            to="/catalogo"
            className="whitespace-nowrap font-titulo text-sm font-bold text-roxo-escuro hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        <ProductGrid produtos={destaques} />
      </section>
    </>
  );
}
