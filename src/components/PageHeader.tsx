export default function PageHeader() {
  return (
    <>
      <div className="mx-auto max-w-conteudo px-5 pt-[18px] text-[0.82rem] text-roxo-escuro">
        Início <span className="text-cinza">&gt;</span> Topos de Bolo
      </div>
      <div className="mx-auto max-w-conteudo px-5 pb-2 pt-1.5">
        <h1 className="mb-1 text-3xl font-extrabold sm:text-4xl">
          Topos de Bolo
        </h1>
        <p className="max-w-2xl text-[0.92rem] text-cinza">
          Topos digitais para imprimir e montar.{" "}
          <span className="font-bold text-roxo-escuro">
            ✔ Arquivos Studio p/ máquina de corte.
          </span>{" "}
          <span className="font-bold text-rosa-escuro">
            ⚠ PDF p/ corte com tesoura só via WhatsApp.
          </span>
        </p>
      </div>
    </>
  );
}
