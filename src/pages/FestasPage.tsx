import CollectionView from "@/components/catalog/CollectionView";

const CATEGORIAS = ["Meninas", "Meninos", "Diversos"];

export default function FestasPage() {
  return (
    <CollectionView
      titulo="Festas"
      subtitulo="Topos para festas de aniversário — temas para meninas, meninos e ideias divertidas para todas as idades."
      categorias={CATEGORIAS}
    />
  );
}
