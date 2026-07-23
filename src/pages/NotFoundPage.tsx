import Button from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-conteudo px-5 py-24 text-center">
      <h1 className="mb-2 text-3xl font-extrabold">Página não encontrada</h1>
      <p className="mb-6 text-cinza">
        O endereço que você tentou acessar não existe.
      </p>
      <Button to="/" variant="primary">
        Voltar ao início
      </Button>
    </div>
  );
}
