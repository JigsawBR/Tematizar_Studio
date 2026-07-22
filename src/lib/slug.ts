// Gera um slug estável a partir do nome: minúsculas, sem acento, só a-z 0-9 e "-".
// A faixa ̀-ͯ são os acentos combinantes que o NFD separa das letras.
const ACENTOS = /[̀-ͯ]/g;

export function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(ACENTOS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
