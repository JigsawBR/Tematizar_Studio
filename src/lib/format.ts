/** Formata número em Real brasileiro: 5 -> "R$ 5,00" */
export const brl = (n: number): string =>
  "R$ " + n.toFixed(2).replace(".", ",");
