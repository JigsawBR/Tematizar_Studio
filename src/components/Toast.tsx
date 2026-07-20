import { useUi } from "../store/ui";

export default function Toast() {
  const toast = useUi((s) => s.toast);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-[30px] bg-ameixa px-5 py-3.5 font-titulo font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,.3)] transition ${
        toast ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"
      }`}
    >
      {toast}
    </div>
  );
}
