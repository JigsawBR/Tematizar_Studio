import { Link } from "react-router-dom";
import type { ReactNode, MouseEventHandler } from "react";

// Botão padrão da loja (design system). 7 variantes + 3 tamanhos.
// Renderiza <button> por padrão; vira <Link> com `to` ou <a> com `href`.
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "outline-light"
  | "ghost"
  | "dark"
  | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl font-titulo font-bold transition disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTES: Record<ButtonVariant, string> = {
  primary: "bg-roxo text-white hover:bg-roxo-escuro",
  secondary: "bg-white text-roxo-escuro shadow-marca hover:bg-creme",
  outline: "border-2 border-roxo text-roxo-escuro hover:bg-roxo-claro",
  "outline-light": "border-2 border-white/70 text-white hover:bg-white/15",
  ghost: "text-roxo-escuro hover:bg-roxo-claro",
  dark: "bg-ameixa text-white hover:opacity-90",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1eb355]",
};

const TAMANHOS: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5",
  lg: "rounded-2xl px-7 py-3.5 text-[1.05rem]",
};

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  className?: string;
  to?: string;
  href?: string;
  onClick?: MouseEventHandler;
  type?: "button" | "submit";
  disabled?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  title?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  full,
  icon,
  iconRight,
  children,
  className = "",
  to,
  href,
  onClick,
  type = "button",
  disabled,
  target,
  rel,
  "aria-label": ariaLabel,
  title,
}: Props) {
  const cls = `${BASE} ${TAMANHOS[size]} ${VARIANTES[variant]} ${
    full ? "w-full" : ""
  } ${className}`;
  const conteudo = (
    <>
      {icon}
      {children}
      {iconRight}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} aria-label={ariaLabel} title={title}>
        {conteudo}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        title={title}
      >
        {conteudo}
      </a>
    );
  }
  return (
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
    >
      {conteudo}
    </button>
  );
}
