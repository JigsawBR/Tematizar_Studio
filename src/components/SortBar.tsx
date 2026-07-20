import { useUi } from "../store/ui";
import type { Ordenacao } from "../types";

interface Props {
  quantidade: number;
}

export default function SortBar({ quantidade }: Props) {
  const { ordenar, setOrdenar } = useUi();

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
      <span className="text-[0.85rem] font-bold text-cinza">
        {quantidade} {quantidade === 1 ? "produto" : "produtos"}
      </span>
      <select
        value={ordenar}
        onChange={(e) => setOrdenar(e.target.value as Ordenacao)}
        className="rounded-[30px] border-2 border-borda bg-white px-3.5 py-2.5 font-corpo font-bold text-ameixa"
      >
        <option value="destaque">Ordenar por: Destaque</option>
        <option value="menor">Menor preço</option>
        <option value="maior">Maior preço</option>
        <option value="az">Nome (A–Z)</option>
      </select>
    </div>
  );
}
