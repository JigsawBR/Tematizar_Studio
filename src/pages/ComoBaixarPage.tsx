import { Link } from "react-router-dom";

const PASSOS = [
  {
    n: 1,
    titulo: "Escolha seus topos",
    texto: "Navegue pelo catálogo, adicione os topos ao carrinho e aplique seu cupom, se tiver.",
  },
  {
    n: 2,
    titulo: "Finalize pelo WhatsApp",
    texto: "No carrinho, clique em “Finalizar pelo WhatsApp”. Sua lista de itens já vai montada na mensagem.",
  },
  {
    n: 3,
    titulo: "Faça o pagamento",
    texto: "Combine o pagamento (PIX) pelo WhatsApp. Assim que confirmado, liberamos o arquivo.",
  },
  {
    n: 4,
    titulo: "Baixe e monte",
    texto: "Você recebe o arquivo digital para imprimir/cortar. Use o arquivo Studio na sua máquina de corte.",
  },
];

const FORMATOS = [
  { titulo: "Arquivo Studio (.studio3)", texto: "Pronto para máquinas de corte Silhouette e compatíveis. Incluso em todos os topos." },
  { titulo: "PDF para corte com tesoura", texto: "Versão para imprimir e recortar à mão. Disponível sob solicitação pelo WhatsApp." },
];

export default function ComoBaixarPage() {
  return (
    <div className="mx-auto max-w-conteudo px-5 py-10">
      <h1 className="mb-2 text-3xl font-extrabold sm:text-4xl">Como baixar</h1>
      <p className="mb-8 max-w-2xl text-cinza">
        Comprar seus topos digitais é rápido. Veja o passo a passo:
      </p>

      <ol className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PASSOS.map((p) => (
          <li
            key={p.n}
            className="flex gap-4 rounded-xl2 border border-borda bg-white p-5 shadow-marca"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-roxo font-titulo text-lg font-extrabold text-white">
              {p.n}
            </span>
            <div>
              <h3 className="font-titulo text-lg font-bold text-roxo-escuro">
                {p.titulo}
              </h3>
              <p className="text-[0.9rem] text-cinza">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mb-4 text-2xl font-extrabold">Formatos dos arquivos</h2>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FORMATOS.map((f) => (
          <div
            key={f.titulo}
            className="rounded-xl2 border border-borda bg-roxo-claro p-5"
          >
            <h3 className="mb-1 font-titulo text-base font-bold text-roxo-escuro">
              {f.titulo}
            </h3>
            <p className="text-[0.9rem] text-cinza">{f.texto}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl2 bg-gradient-to-r from-roxo to-rosa p-6 text-center text-white">
        <p className="mb-3 font-titulo text-lg font-bold">
          Ainda com dúvidas?
        </p>
        <Link
          to="/contato"
          className="inline-block rounded-xl bg-white px-6 py-3 font-titulo font-bold text-roxo-escuro transition hover:bg-creme"
        >
          Fale com a gente
        </Link>
      </div>
    </div>
  );
}
