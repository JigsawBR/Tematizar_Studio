import { useUi } from "@/store/ui";
import { useCatalog } from "@/store/catalog";

export default function Filters() {
  const {
    categoria,
    setCategoria,
    precoMin,
    precoMax,
    setPrecoMin,
    setPrecoMax,
  } = useUi();
  const produtos = useCatalog((s) => s.produtos);
  const CATEGORIAS = useCatalog((s) => s.categorias);

  const contar = (c: string) => produtos.filter((p) => p.cat === c).length;

  return (
    // top-[150px]: fica abaixo do cabeçalho fixo (header + menu).
    <aside className="flex flex-row gap-3.5 overflow-x-auto pb-1.5 lg:sticky lg:top-[150px] lg:flex-col lg:overflow-visible">
      {/* Categorias */}
      <div className="min-w-[230px] overflow-hidden rounded-xl2 border border-borda bg-white shadow-marca lg:min-w-0">
        <h3 className="flex items-center justify-between px-4.5 py-4 text-[0.95rem]">
          Categorias <span>▾</span>
        </h3>
        <div className="px-4.5 pb-4.5">
          <CatItem
            label="Ver todos"
            n={produtos.length}
            ativo={!categoria}
            onClick={() => setCategoria(null)}
          />
          {CATEGORIAS.map((c) => (
            <CatItem
              key={c}
              label={c}
              n={contar(c)}
              ativo={categoria === c}
              onClick={() => setCategoria(c)}
            />
          ))}
        </div>
      </div>

      {/* Preço */}
      <div className="min-w-[230px] overflow-hidden rounded-xl2 border border-borda bg-white shadow-marca lg:min-w-0">
        <h3 className="flex items-center justify-between px-4.5 py-4 text-[0.95rem]">
          Preço <span>▾</span>
        </h3>
        <div className="px-4.5 pb-4.5">
          <div className="flex items-end gap-2.5">
            <CampoPreco
              label="De"
              value={precoMin}
              onChange={setPrecoMin}
              placeholder="0"
            />
            <CampoPreco
              label="Até"
              value={precoMax}
              onChange={setPrecoMax}
              placeholder="20"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

function CatItem({
  label,
  n,
  ativo,
  onClick,
}: {
  label: string;
  n: number;
  ativo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-[10px] px-2.5 py-2 text-left text-[0.86rem] font-semibold transition ${
        ativo ? "bg-roxo text-white" : "text-ameixa hover:bg-roxo-claro"
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-[20px] px-2 py-px text-[0.72rem] font-extrabold ${
          ativo ? "bg-white/25 text-white" : "bg-roxo-claro text-roxo-escuro"
        }`}
      >
        {n}
      </span>
    </button>
  );
}

function CampoPreco({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex-1">
      <label className="mb-1 block text-[0.72rem] font-bold text-cinza">
        {label}
      </label>
      <input
        type="number"
        min={0}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border-2 border-borda p-2.5 font-corpo font-bold focus:border-roxo focus:outline-none"
      />
    </div>
  );
}
