import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-conteudo px-5 py-24 text-center">
      <span className="mb-3 block text-6xl">🎂</span>
      <h1 className="mb-2 text-3xl font-extrabold">Página não encontrada</h1>
      <p className="mb-6 text-cinza">
        O endereço que você tentou acessar não existe.
      </p>
      <Link
        to="/"
        className="inline-block rounded-xl bg-roxo px-6 py-3 font-titulo font-bold text-white"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
