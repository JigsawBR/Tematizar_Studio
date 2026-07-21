import type { Produto } from "@/types";

interface Props {
  produto: Produto;
  className?: string;
}

/**
 * Placeholder de imagem gerado em SVG (um "bolo").
 * Se o produto tiver `img`, mostra a foto real no lugar.
 */
export default function CakePlaceholder({ produto, className }: Props) {
  if (produto.img) {
    return (
      <img
        src={produto.img}
        alt={produto.nome}
        loading="lazy"
        className={className ?? "h-full w-full object-cover"}
      />
    );
  }

  const { c1, c2, topo } = produto;
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? "h-full w-full"}
      role="img"
      aria-label={produto.nome}
    >
      <rect width="200" height="200" fill={c2} opacity="0.25" />
      <text
        x="100"
        y="66"
        fontSize="52"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {topo}
      </text>
      <rect x="52" y="96" width="96" height="60" rx="10" fill={c1} />
      <rect x="52" y="96" width="96" height="16" rx="8" fill="#ffffff" opacity="0.85" />
      <path
        d="M52 112 q12 12 24 0 t24 0 t24 0 t24 0 v10 h-96z"
        fill="#ffffff"
        opacity="0.85"
      />
      <rect x="44" y="156" width="112" height="12" rx="6" fill={c2} />
      <circle cx="72" cy="130" r="4" fill={c2} />
      <circle cx="100" cy="140" r="4" fill={c2} />
      <circle cx="128" cy="128" r="4" fill={c2} />
    </svg>
  );
}
