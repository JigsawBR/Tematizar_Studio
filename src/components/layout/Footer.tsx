import { Link } from "react-router-dom";
import { WHATSAPP } from "@/config";

export default function Footer() {
  return (
    <footer className="mt-10 bg-ameixa text-white">
      <div className="mx-auto grid max-w-conteudo grid-cols-1 gap-8 px-5 py-11 sm:grid-cols-3">
        <div>
          <h4 className="mb-3.5 font-titulo text-base text-rosa">
            Tematizar Studio
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
            <li>
              <Link
                to="/como-baixar"
                className="text-[0.88rem] opacity-85 transition hover:text-rosa hover:opacity-100"
              >
                Como baixar os arquivos
              </Link>
            </li>
            <li>
              <Link
                to="/catalogo"
                className="text-[0.88rem] opacity-85 transition hover:text-rosa hover:opacity-100"
              >
                Ver todos os topos
              </Link>
            </li>
            <li>
              <Link
                to="/contato"
                className="text-[0.88rem] opacity-85 transition hover:text-rosa hover:opacity-100"
              >
                Fale conosco
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3.5 font-titulo text-base text-rosa">Fale conosco</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.88rem] opacity-85 transition hover:text-rosa hover:opacity-100"
              >
                💬 WhatsApp
              </a>
            </li>
            <li>
              <Link
                to="/contato"
                className="text-[0.88rem] opacity-85 transition hover:text-rosa hover:opacity-100"
              >
                📷 Instagram
              </Link>
            </li>
            <li>
              <Link
                to="/contato"
                className="text-[0.88rem] opacity-85 transition hover:text-rosa hover:opacity-100"
              >
                ✉ E-mail
              </Link>
            </li>
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
