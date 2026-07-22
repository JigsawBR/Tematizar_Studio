import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useCatalog } from "@/store/catalog";
import { useUi } from "@/store/ui";
import { supabase } from "@/lib/supabase";
import { brl } from "@/lib/format";
import { slugify } from "@/lib/slug";

interface Categoria {
  id: string;
  nome: string;
}

interface ProdutoAdmin {
  id: string;
  numero: number;
  nome: string;
  slug: string;
  categoria_id: string | null;
  preco_centavos: number;
  descricao: string | null;
  emoji: string | null;
  cor_primaria: string | null;
  cor_secundaria: string | null;
  imagem_url: string | null;
  arquivo_studio_path: string | null;
  arquivo_pdf_path: string | null;
  ativo: boolean;
  destaque: boolean;
}

interface Form {
  id?: string;
  nome: string;
  slug: string;
  categoria_id: string;
  precoReais: string;
  descricao: string;
  emoji: string;
  cor_primaria: string;
  cor_secundaria: string;
  imagem_url: string;
  arquivo_studio_path: string;
  arquivo_pdf_path: string;
  ativo: boolean;
  destaque: boolean;
}

const COLUNAS =
  "id, numero, nome, slug, categoria_id, preco_centavos, descricao, emoji, cor_primaria, cor_secundaria, imagem_url, arquivo_studio_path, arquivo_pdf_path, ativo, destaque";

function formVazio(categoriaId: string): Form {
  return {
    nome: "",
    slug: "",
    categoria_id: categoriaId,
    precoReais: "",
    descricao: "",
    emoji: "🎂",
    cor_primaria: "#e9d5ff",
    cor_secundaria: "#a78bfa",
    imagem_url: "",
    arquivo_studio_path: "",
    arquivo_pdf_path: "",
    ativo: true,
    destaque: false,
  };
}

function paraForm(p: ProdutoAdmin, categoriaFallback: string): Form {
  return {
    id: p.id,
    nome: p.nome,
    slug: p.slug,
    categoria_id: p.categoria_id ?? categoriaFallback,
    precoReais: (p.preco_centavos / 100).toString(),
    descricao: p.descricao ?? "",
    emoji: p.emoji ?? "",
    cor_primaria: p.cor_primaria ?? "#e9d5ff",
    cor_secundaria: p.cor_secundaria ?? "#a78bfa",
    imagem_url: p.imagem_url ?? "",
    arquivo_studio_path: p.arquivo_studio_path ?? "",
    arquivo_pdf_path: p.arquivo_pdf_path ?? "",
    ativo: p.ativo,
    destaque: p.destaque,
  };
}

export default function AdminPage() {
  const { carregando: carregandoAuth, user, ehAdmin } = useAuth();
  const recarregarVitrine = useCatalog((s) => s.carregar);
  const mostrarToast = useUi((s) => s.mostrarToast);

  const [produtos, setProdutos] = useState<ProdutoAdmin[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState<Form | null>(null);

  const carregar = async () => {
    setCarregando(true);
    const [prod, cat] = await Promise.all([
      supabase.from("produtos").select(COLUNAS).order("numero"),
      supabase.from("categorias").select("id, nome").order("ordem"),
    ]);
    setProdutos((prod.data as ProdutoAdmin[] | null) ?? []);
    setCategorias((cat.data as Categoria[] | null) ?? []);
    setCarregando(false);
  };

  useEffect(() => {
    if (ehAdmin) void carregar();
  }, [ehAdmin]);

  // Alterna um booleano (ativo/destaque) direto na lista.
  const alternar = async (
    p: ProdutoAdmin,
    campo: "ativo" | "destaque",
  ) => {
    const novo = !p[campo];
    setProdutos((lista) =>
      lista.map((x) => (x.id === p.id ? { ...x, [campo]: novo } : x)),
    );
    const { error } = await supabase
      .from("produtos")
      .update({ [campo]: novo })
      .eq("id", p.id);
    if (error) {
      mostrarToast("Não foi possível salvar. Tente de novo.");
      void carregar();
      return;
    }
    void recarregarVitrine();
  };

  if (carregandoAuth) {
    return <Aviso>Carregando…</Aviso>;
  }
  if (!user) {
    return (
      <Aviso>
        <p className="mb-4">Entre para acessar o painel.</p>
        <Link to="/entrar?redirect=/admin" className="text-roxo-escuro underline">
          Fazer login
        </Link>
      </Aviso>
    );
  }
  if (!ehAdmin) {
    return (
      <Aviso>
        <span className="mb-3 block text-5xl">🔒</span>
        Acesso restrito. Esta área é só para administradores.
      </Aviso>
    );
  }

  return (
    <div className="mx-auto max-w-conteudo px-5 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Painel · Produtos</h1>
          <p className="text-[0.9rem] text-cinza">
            {produtos.length} produtos · edições aparecem na loja na hora.
          </p>
        </div>
        <button
          onClick={() => setForm(formVazio(categorias[0]?.id ?? ""))}
          className="shrink-0 rounded-xl bg-roxo px-5 py-3 font-titulo font-bold text-white transition hover:bg-roxo-escuro"
        >
          ＋ Novo produto
        </button>
      </div>

      {carregando ? (
        <div className="py-16 text-center text-cinza">Carregando…</div>
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-borda bg-white shadow-marca">
          {produtos.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 border-b border-borda px-4 py-3 last:border-0"
            >
              <div
                className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg text-2xl"
                style={{ background: (p.cor_primaria ?? "#eee") + "55" }}
              >
                {p.imagem_url ? (
                  <img
                    src={p.imagem_url}
                    alt={p.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{p.emoji ?? "🎂"}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-titulo text-[0.92rem] font-bold">
                  {p.nome}
                </div>
                <div className="text-[0.8rem] text-cinza">
                  {brl(p.preco_centavos / 100)} ·{" "}
                  {p.arquivo_studio_path ? "arquivo ✔" : "sem arquivo ⚠"}
                </div>
              </div>
              <Chip
                on={p.destaque}
                onClick={() => alternar(p, "destaque")}
                label="Destaque"
              />
              <Chip
                on={p.ativo}
                onClick={() => alternar(p, "ativo")}
                label={p.ativo ? "Ativo" : "Oculto"}
              />
              <button
                onClick={() => setForm(paraForm(p, categorias[0]?.id ?? ""))}
                className="shrink-0 rounded-lg border-2 border-borda px-3 py-1.5 font-titulo text-sm font-bold text-roxo-escuro transition hover:border-roxo"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      )}

      {form && (
        <ProdutoModal
          form={form}
          setForm={setForm}
          categorias={categorias}
          onFechar={() => setForm(null)}
          onSalvo={() => {
            setForm(null);
            void carregar();
            void recarregarVitrine();
          }}
        />
      )}
    </div>
  );
}

function ProdutoModal({
  form,
  setForm,
  categorias,
  onFechar,
  onSalvo,
}: {
  form: Form;
  setForm: (f: Form) => void;
  categorias: Categoria[];
  onFechar: () => void;
  onSalvo: () => void;
}) {
  const mostrarToast = useUi((s) => s.mostrarToast);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [subindo, setSubindo] = useState<"imagem" | "arquivo" | null>(null);

  const set = <K extends keyof Form>(campo: K, valor: Form[K]) =>
    setForm({ ...form, [campo]: valor });

  // slug base para nomear os arquivos no storage.
  const slugBase = () => form.slug || slugify(form.nome);

  const subirImagem = async (file: File) => {
    if (!slugBase()) {
      setErro("Preencha o nome antes de subir a imagem.");
      return;
    }
    setSubindo("imagem");
    setErro(null);
    const ext = file.name.split(".").pop() ?? "jpg";
    const caminho = `${slugBase()}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("produtos-fotos")
      .upload(caminho, file, { upsert: true });
    if (error) {
      setErro("Falha ao subir a imagem.");
      setSubindo(null);
      return;
    }
    const { data } = supabase.storage.from("produtos-fotos").getPublicUrl(caminho);
    setForm({ ...form, imagem_url: data.publicUrl });
    setSubindo(null);
  };

  const subirArquivo = async (file: File) => {
    if (!slugBase()) {
      setErro("Preencha o nome antes de subir o arquivo.");
      return;
    }
    setSubindo("arquivo");
    setErro(null);
    const caminho = `${slugBase()}/${file.name}`;
    const { error } = await supabase.storage
      .from("arquivos")
      .upload(caminho, file, { upsert: true });
    if (error) {
      setErro("Falha ao subir o arquivo.");
      setSubindo(null);
      return;
    }
    setForm({ ...form, arquivo_studio_path: caminho });
    setSubindo(null);
  };

  const salvar = async () => {
    setErro(null);
    if (!form.nome.trim()) return setErro("Dê um nome ao produto.");
    const centavos = Math.round(
      parseFloat(form.precoReais.replace(",", ".")) * 100,
    );
    if (!Number.isFinite(centavos) || centavos < 0)
      return setErro("Preço inválido.");

    setSalvando(true);
    const slug = form.id ? form.slug : slugify(form.nome);
    const payload = {
      nome: form.nome.trim(),
      slug,
      categoria_id: form.categoria_id || null,
      preco_centavos: centavos,
      descricao: form.descricao.trim() || null,
      emoji: form.emoji || null,
      cor_primaria: form.cor_primaria,
      cor_secundaria: form.cor_secundaria,
      imagem_url: form.imagem_url || null,
      arquivo_studio_path: form.arquivo_studio_path || null,
      arquivo_pdf_path: form.arquivo_pdf_path || null,
      ativo: form.ativo,
      destaque: form.destaque,
    };

    const resp = form.id
      ? await supabase.from("produtos").update(payload).eq("id", form.id)
      : await supabase.from("produtos").insert(payload);

    setSalvando(false);
    if (resp.error) {
      if (resp.error.code === "23505")
        return setErro("Já existe um produto com esse nome. Mude o nome.");
      return setErro("Não foi possível salvar. Tente de novo.");
    }
    mostrarToast(form.id ? "Produto atualizado! ✅" : "Produto criado! 🎉");
    onSalvo();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ameixa/45 p-4"
      onClick={onFechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-6 w-full max-w-lg rounded-xl2 border border-borda bg-white p-6 shadow-marca"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-titulo text-xl font-bold text-roxo-escuro">
            {form.id ? "Editar produto" : "Novo produto"}
          </h2>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="text-2xl leading-none text-cinza"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <Campo label="Nome">
            <input
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder="Topo de Bolo ..."
              className={inputCls}
            />
          </Campo>

          <div className="flex gap-3">
            <Campo label="Categoria" className="flex-1">
              <select
                value={form.categoria_id}
                onChange={(e) => set("categoria_id", e.target.value)}
                className={inputCls}
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo label="Preço (R$)" className="w-32">
              <input
                value={form.precoReais}
                onChange={(e) => set("precoReais", e.target.value)}
                inputMode="decimal"
                placeholder="5,00"
                className={inputCls}
              />
            </Campo>
          </div>

          <Campo label="Descrição">
            <textarea
              value={form.descricao}
              onChange={(e) => set("descricao", e.target.value)}
              rows={2}
              placeholder="(opcional)"
              className={inputCls}
            />
          </Campo>

          {/* Placeholder: emoji + cores (usado quando não há foto) */}
          <div className="flex items-end gap-3">
            <Campo label="Emoji" className="w-20">
              <input
                value={form.emoji}
                onChange={(e) => set("emoji", e.target.value)}
                className={`${inputCls} text-center text-xl`}
              />
            </Campo>
            <Campo label="Cor 1" className="flex-1">
              <input
                type="color"
                value={form.cor_primaria}
                onChange={(e) => set("cor_primaria", e.target.value)}
                className="h-11 w-full rounded-xl border-2 border-borda"
              />
            </Campo>
            <Campo label="Cor 2" className="flex-1">
              <input
                type="color"
                value={form.cor_secundaria}
                onChange={(e) => set("cor_secundaria", e.target.value)}
                className="h-11 w-full rounded-xl border-2 border-borda"
              />
            </Campo>
          </div>

          {/* Uploads */}
          <Campo label="Imagem (substitui o placeholder)">
            <div className="flex items-center gap-3">
              {form.imagem_url && (
                <img
                  src={form.imagem_url}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && subirImagem(e.target.files[0])
                }
                className="text-[0.82rem]"
              />
              {subindo === "imagem" && (
                <span className="text-[0.8rem] text-cinza">enviando…</span>
              )}
            </div>
          </Campo>

          <Campo label="Arquivo entregável (.studio / PDF)">
            <div className="flex items-center gap-3">
              {form.arquivo_studio_path && (
                <span className="max-w-[55%] truncate text-[0.8rem] text-roxo-escuro">
                  {form.arquivo_studio_path.split("/").pop()}
                </span>
              )}
              <input
                type="file"
                onChange={(e) =>
                  e.target.files?.[0] && subirArquivo(e.target.files[0])
                }
                className="text-[0.82rem]"
              />
              {subindo === "arquivo" && (
                <span className="text-[0.8rem] text-cinza">enviando…</span>
              )}
            </div>
          </Campo>

          <div className="flex gap-5 pt-1">
            <label className="flex items-center gap-2 text-[0.9rem] font-bold text-ameixa">
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(e) => set("ativo", e.target.checked)}
              />
              Ativo (aparece na loja)
            </label>
            <label className="flex items-center gap-2 text-[0.9rem] font-bold text-ameixa">
              <input
                type="checkbox"
                checked={form.destaque}
                onChange={(e) => set("destaque", e.target.checked)}
              />
              Destaque
            </label>
          </div>

          {erro && (
            <div className="rounded-lg bg-rosa-claro px-3 py-2 text-[0.85rem] font-bold text-rosa-escuro">
              {erro}
            </div>
          )}

          <button
            onClick={salvar}
            disabled={salvando || subindo !== null}
            className="mt-2 rounded-xl bg-roxo py-3 font-titulo font-bold text-white transition hover:bg-roxo-escuro disabled:opacity-60"
          >
            {salvando ? "Salvando…" : "Salvar produto"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border-2 border-borda bg-creme px-3.5 py-2.5 font-corpo transition focus:border-roxo focus:bg-white focus:outline-none";

function Campo({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ""}`}>
      <span className="text-[0.78rem] font-bold text-ameixa">{label}</span>
      {children}
    </label>
  );
}

function Chip({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`hidden shrink-0 rounded-full px-3 py-1 font-titulo text-[0.72rem] font-extrabold transition sm:block ${
        on
          ? "bg-roxo text-white"
          : "bg-borda/40 text-cinza hover:bg-borda"
      }`}
    >
      {label}
    </button>
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center text-cinza">
      {children}
    </div>
  );
}
