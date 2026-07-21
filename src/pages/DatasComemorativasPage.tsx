import CollectionView from "@/components/catalog/CollectionView";

const CATEGORIAS = ["Datas", "Páscoa"];

export default function DatasComemorativasPage() {
  return (
    <CollectionView
      titulo="Datas Comemorativas"
      subtitulo="Topos para as datas especiais do ano — Natal, Festa Junina, Páscoa e muito mais."
      categorias={CATEGORIAS}
    />
  );
}
