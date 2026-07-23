// Bloco de esqueleto (placeholder animado) para estados de carregamento.
export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded-lg bg-roxo-claro ${className}`}
      aria-hidden="true"
    />
  );
}

// Card de produto no formato do ProductCard, para a grade em carregamento.
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-borda bg-white shadow-marca">
      <Skeleton className="aspect-square rounded-none" />
      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="mt-1 h-5 w-1/2" />
        <Skeleton className="mt-1 h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
