import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "@/store/cart";
import Icon, { type IconName } from "@/components/ui/Icon";

type Status = "sucesso" | "pendente" | "falha";

const CONTEUDO: Record<
  Status,
  { icon: IconName; erro?: boolean; titulo: string; texto: string }
> = {
  sucesso: {
    icon: "check",
    titulo: "Pagamento aprovado!",
    texto:
      "Recebemos seu pagamento. Seus topos já estão liberados em Meus Downloads.",
  },
  pendente: {
    icon: "clock",
    titulo: "Pagamento em processamento",
    texto:
      "Se você pagou via PIX, pode levar alguns instantes para confirmar. Assim que aprovar, seus topos aparecem em Meus Downloads.",
  },
  falha: {
    icon: "alert",
    erro: true,
    titulo: "Não foi possível concluir o pagamento",
    texto:
      "Nada foi cobrado. Você pode tentar novamente ou falar com a gente pelo WhatsApp.",
  },
};

export default function PedidoStatusPage() {
  const { status } = useParams<{ status: Status }>();
  const info = CONTEUDO[(status as Status) ?? "pendente"] ?? CONTEUDO.pendente;
  const limpar = useCart((s) => s.limpar);

  // Ao aprovar, o carrinho já cumpriu seu papel.
  useEffect(() => {
    if (status === "sucesso") limpar();
  }, [status, limpar]);

  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <span
        className={`mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full ${
          info.erro
            ? "bg-rosa-claro text-rosa-escuro"
            : "bg-roxo-claro text-roxo-escuro"
        }`}
      >
        <Icon name={info.icon} size={30} />
      </span>
      <h1 className="mb-3 text-2xl font-extrabold text-roxo-escuro">
        {info.titulo}
      </h1>
      <p className="mb-8 text-cinza">{info.texto}</p>
      <div className="flex flex-col gap-3">
        {status !== "falha" && (
          <Link
            to="/downloads"
            className="rounded-xl bg-roxo py-3.5 font-titulo font-bold text-white transition hover:bg-roxo-escuro"
          >
            Ir para Meus Downloads
          </Link>
        )}
        <Link
          to="/catalogo"
          className="rounded-xl border-2 border-roxo py-3 font-titulo font-bold text-roxo-escuro transition hover:bg-roxo-claro"
        >
          Voltar ao catálogo
        </Link>
      </div>
    </div>
  );
}
