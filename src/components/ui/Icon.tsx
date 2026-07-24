import type { ReactNode } from "react";

// Set de ícones SVG (portado do design system). Todos herdam a cor via
// `currentColor` e o tamanho pela prop `size`. Substituem os emoji de interface.
export type IconName =
  | "user"
  | "chat"
  | "cart"
  | "search"
  | "bolt"
  | "scissors"
  | "download"
  | "check"
  | "alert"
  | "clock"
  | "arrow"
  | "chevronDown"
  | "trash"
  | "card"
  | "close"
  | "instagram"
  | "mail"
  | "lock"
  | "painel"
  | "crown"
  | "rocket"
  | "baby"
  | "egg"
  | "cap"
  | "gift";

const ICONES: Record<IconName, { filled?: boolean; node: ReactNode }> = {
  user: {
    node: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
      </>
    ),
  },
  chat: { node: <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.7A8 8 0 1 1 21 12Z" /> },
  cart: {
    node: (
      <>
        <path d="M3 4h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.2L21 8H6" />
        <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
  },
  search: {
    node: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </>
    ),
  },
  bolt: { filled: true, node: <path d="M13.5 2 4 13.2h6l-1.5 8.8L20 10.4h-6L13.5 2Z" /> },
  scissors: {
    node: (
      <>
        <circle cx="6" cy="6" r="2.6" />
        <circle cx="6" cy="18" r="2.6" />
        <path d="M8 8l12 8M8 16l12-8" />
      </>
    ),
  },
  download: {
    node: (
      <>
        <path d="M12 3v11M7 10l5 5 5-5" />
        <path d="M5 20h14" />
      </>
    ),
  },
  check: { node: <path d="M20 6 9 17l-5-5" /> },
  alert: {
    node: (
      <>
        <path d="M12 3 2 20h20L12 3Z" />
        <path d="M12 10v4M12 17.5v.5" />
      </>
    ),
  },
  clock: {
    node: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  arrow: { node: <path d="M5 12h14M13 6l6 6-6 6" /> },
  chevronDown: { node: <path d="M6 9l6 6 6-6" /> },
  trash: {
    node: (
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    ),
  },
  card: {
    node: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3 10h18" />
      </>
    ),
  },
  close: { node: <path d="M6 6l12 12M18 6 6 18" /> },
  instagram: {
    node: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  mail: {
    node: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  },
  lock: {
    node: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
  painel: {
    node: (
      <>
        <rect x="3" y="3" width="7.5" height="9" rx="1.6" />
        <rect x="13.5" y="3" width="7.5" height="5.5" rx="1.6" />
        <rect x="13.5" y="12" width="7.5" height="9" rx="1.6" />
        <rect x="3" y="15.5" width="7.5" height="5.5" rx="1.6" />
      </>
    ),
  },
  crown: { node: <path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13L4 8Z" /> },
  rocket: {
    node: (
      <>
        <path d="M12 3c3 1.5 5 4.5 5 8 0 2-.7 3.6-1.5 4.8H8.5C7.7 14.6 7 13 7 11c0-3.5 2-6.5 5-8Z" />
        <circle cx="12" cy="10" r="1.6" />
        <path d="M8.5 16 6 20l3.5-1M15.5 16 18 20l-3.5-1" />
      </>
    ),
  },
  baby: {
    node: (
      <>
        <circle cx="12" cy="9" r="5" />
        <path d="M9 8.5h.01M15 8.5h.01M10 11.5c1 .8 3 .8 4 0" />
        <path d="M6 15c1.5 3 4 4.5 6 4.5S16.5 18 18 15" />
      </>
    ),
  },
  egg: {
    node: (
      <>
        <path d="M12 3c3.3 0 6 4.5 6 9a6 6 0 0 1-12 0c0-4.5 2.7-9 6-9Z" />
        <path d="M8 15c1 .9 2.3.9 3.3 0M12.7 15c1 .9 2.3.9 3.3 0" />
      </>
    ),
  },
  cap: {
    node: (
      <>
        <path d="M2 9l10-4 10 4-10 4L2 9Z" />
        <path d="M6 11v4c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4M20 10v4" />
      </>
    ),
  },
  gift: {
    node: (
      <>
        <rect x="4" y="9" width="16" height="11" rx="1.5" />
        <path d="M4 13h16M12 9v11" />
        <path d="M12 9C10.5 9 8 8.5 8 6.5S10.5 4 12 9Zm0 0c1.5 0 4-.5 4-2.5S13.5 4 12 9Z" />
      </>
    ),
  },
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export default function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.8,
}: IconProps) {
  const { filled, node } = ICONES[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={filled ? 0 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      {node}
    </svg>
  );
}
