import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useUi } from "@/store/ui";
import { supabase } from "@/lib/supabase";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

interface LinhaDownload {
  id: string;
  produto_id: string;
  arquivo_path: string | null;
  produtos: { nome: string; emoji: string | null } | null;
}

export default function DownloadsPage() {
  const { user, carregando } = useAuth();
  const mostrarToast = useUi((s) => s.mostrarToast);

  const [linhas, setLinhas] = useState<LinhaDownload[]>([]);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    if (!user) return;
    setBuscando(true);
    supabase
      .from("downloads")
      .select("id, produto_id, arquivo_path, produtos(nome, emoji)")
      .order("criado_em", { ascending: false })
      .then(({ data }) => {
        setLinhas((data as unknown as LinhaDownload[]) ?? []);
        setBuscando(false);
      });
  }, [user]);

  const baixar = async (produtoId: string) => {
    // A Edge Function 'download' confere a compra e devolve uma URL assinada.
    const { data, error } = await supabase.functions.invoke("download", {
      body: { produto_id: produtoId },
    });
    if (error || !data?.url) {
      mostrarToast("Arquivo ainda não disponível. Fale com a gente.");
      return;
    }
    window.open(data.url, "_blank", "noopener");
  };

  if (carregando) {
    return (
      <div className="mx-auto max-w-conteudo px-5 py-20 text-center text-cinza">
        Carregando...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-conteudo px-5 py-10">
      <h1 className="mb-2 text-3xl font-extrabold sm:text-4xl">Meus Downloads</h1>
      <p className="mb-8 max-w-2xl text-cinza">
        Aqui ficam suas compras. Depois do pagamento confirmado, você baixa seus
        topos quantas vezes precisar.
      </p>

      {!user ? (
        <div className="mx-auto max-w-md rounded-xl2 border border-borda bg-white p-8 text-center shadow-marca">
          <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-roxo-claro text-roxo-escuro">
            <Icon name="lock" size={28} />
          </span>
          <h2 className="mb-2 font-titulo text-xl font-bold text-roxo-escuro">
            Entre na sua conta
          </h2>
          <p className="mb-6 text-[0.9rem] text-cinza">
            Faça login para ver seu histórico de compras e baixar novamente seus
            topos.
          </p>
          <Button to="/entrar?redirect=/downloads" variant="primary" full className="mb-3">
            Entrar
          </Button>
          <p className="text-[0.8rem] text-cinza">
            Ainda não comprou?{" "}
            <Link to="/catalogo" className="font-bold text-roxo-escuro hover:underline">
              Ver catálogo
            </Link>
          </p>
        </div>
      ) : buscando ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl2 border border-borda bg-white p-4"
            >
              <Skeleton className="h-14 w-14 shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
              <Skeleton className="h-9 w-20 rounded-xl" />
            </div>
          ))}
        </div>
      ) : linhas.length === 0 ? (
        <div className="rounded-xl2 border border-borda bg-white p-10 text-center shadow-marca">
          <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-roxo-claro text-roxo-escuro">
            <Icon name="download" size={28} />
          </span>
          <h2 className="mb-2 font-titulo text-xl font-bold text-roxo-escuro">
            Você ainda não tem downloads
          </h2>
          <p className="mb-6 text-[0.9rem] text-cinza">
            Quando você comprar um topo, ele aparece aqui para download.
          </p>
          <Button to="/catalogo" variant="primary">
            Escolher meus topos
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {linhas.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-4 rounded-xl2 border border-borda bg-white p-4 shadow-marca"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[10px] bg-roxo-claro text-3xl">
                {l.produtos?.emoji ?? "🎂"}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-titulo font-bold text-ameixa">
                  {l.produtos?.nome ?? "Topo de bolo"}
                </h3>
                <p className="text-[0.82rem] text-cinza">Compra confirmada</p>
              </div>
              {l.arquivo_path ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => baixar(l.produto_id)}
                  className="shrink-0"
                  icon={<Icon name="download" size={16} />}
                >
                  Baixar
                </Button>
              ) : (
                <span className="shrink-0 rounded-xl border-2 border-borda px-4 py-2 font-titulo text-sm font-bold text-cinza">
                  Em preparação
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
