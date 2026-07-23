import { useEffect, type RefObject } from "react";

const FOCAVEIS =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

// Prende o foco do teclado dentro de `ref` enquanto `ativo` for true (diálogos/
// drawers). Foca o primeiro elemento ao abrir e devolve o foco ao anterior ao
// fechar — comportamento esperado de um modal acessível.
export function useFocusTrap(
  ativo: boolean,
  ref: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!ativo) return;
    const container = ref.current;
    if (!container) return;

    const anterior = document.activeElement as HTMLElement | null;
    const lista = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCAVEIS)).filter(
        (el) => el.offsetParent !== null,
      );

    (lista()[0] ?? container).focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const els = lista();
      if (els.length === 0) return;
      const primeiro = els[0];
      const ultimo = els[els.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };

    container.addEventListener("keydown", onKey);
    return () => {
      container.removeEventListener("keydown", onKey);
      anterior?.focus?.();
    };
  }, [ativo, ref]);
}
