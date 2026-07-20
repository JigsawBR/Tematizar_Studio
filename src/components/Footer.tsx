export default function Footer() {
  return (
    <footer className="mt-10 bg-ameixa text-white">
      <div className="mx-auto grid max-w-conteudo grid-cols-1 gap-8 px-5 py-11 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <h4 className="mb-3.5 font-titulo text-base text-rosa">
            🎂 Tematizar Studio
          </h4>
          <p className="text-[0.88rem] leading-relaxed opacity-80">
            Topos de bolo digitais para você imprimir, cortar e montar. Download
            imediato após a confirmação do pagamento. Deixe sua festa ainda mais
            linda!
          </p>
        </div>
        <div>
          <h4 className="mb-3.5 font-titulo text-base text-rosa">
            Institucional
          </h4>
          <ul className="flex flex-col gap-2">
            {[
              "Como baixar os arquivos",
              "Perguntas frequentes",
              "Política de privacidade",
              "Trocas e reembolsos",
            ].map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="text-[0.88rem] opacity-85 transition hover:text-rosa hover:opacity-100"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3.5 font-titulo text-base text-rosa">Fale conosco</h4>
          <ul className="flex flex-col gap-2">
            {["💬 WhatsApp", "📷 Instagram", "✉ E-mail"].map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="text-[0.88rem] opacity-85 transition hover:text-rosa hover:opacity-100"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 px-5 py-4 text-center text-[0.8rem] opacity-70">
        © 2026 Tematizar Studio — Arquivos Digitais. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
