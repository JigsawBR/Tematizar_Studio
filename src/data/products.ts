import type { Produto } from "../types";

// ===========================================================
// 🛍️ PRODUTOS — adicione/edite os seus aqui.
// O campo `cat` precisa bater com um item de CATEGORIAS.
// Para usar foto real, adicione `img: "/produtos/arquivo.jpg"`
// (coloque a imagem em public/produtos/).
// ===========================================================
export const PRODUTOS: Produto[] = [
  { id: 1, slug: "ursinho-cha-revelacao", nome: "Topo de Bolo Ursinho Chá Revelação", cat: "Chá de Bebê", preco: 5, c1: "#8ecae6", c2: "#219ebc", topo: "🧸" },
  { id: 2, slug: "coelho-da-pascoa", nome: "Topo de Bolo Coelho da Páscoa", cat: "Páscoa", preco: 5, c1: "#a7d8b0", c2: "#52b788", topo: "🐰" },
  { id: 3, slug: "fundo-do-mar-sereia", nome: "Topo de Bolo Fundo do Mar / Sereia", cat: "Meninas", preco: 5, c1: "#90e0ef", c2: "#0096c7", topo: "🧜‍♀️" },
  { id: 4, slug: "astronauta-no-espaco", nome: "Topo de Bolo Astronauta no Espaço", cat: "Meninos", preco: 6, c1: "#b8c0ff", c2: "#5a67d8", topo: "🚀" },
  { id: 5, slug: "jardim-encantado", nome: "Topo de Bolo Jardim Encantado", cat: "Meninas", preco: 5, c1: "#ffd6e0", c2: "#f582ae", topo: "🌸" },
  { id: 6, slug: "fazendinha", nome: "Topo de Bolo Fazendinha", cat: "Meninos", preco: 6, c1: "#ffe066", c2: "#f4a261", topo: "🐮" },
  { id: 7, slug: "circo-divertido", nome: "Topo de Bolo Circo Divertido", cat: "Diversos", preco: 5, c1: "#ff8fab", c2: "#e63946", topo: "🎪" },
  { id: 8, slug: "dinossauro", nome: "Topo de Bolo Dinossauro", cat: "Meninos", preco: 7, c1: "#95d5b2", c2: "#40916c", topo: "🦕" },
  { id: 9, slug: "unicornio", nome: "Topo de Bolo Unicórnio", cat: "Meninas", preco: 5, c1: "#e0c3fc", c2: "#8e7dbe", topo: "🦄" },
  { id: 10, slug: "futebol", nome: "Topo de Bolo Futebol", cat: "Meninos", preco: 6, c1: "#a9def9", c2: "#3a86ff", topo: "⚽" },
  { id: 11, slug: "abc-formatura", nome: "Topo de Bolo ABC / Formatura", cat: "Formatura", preco: 5, c1: "#ffd670", c2: "#ff9770", topo: "🎓" },
  { id: 12, slug: "batizado", nome: "Topo de Bolo Batizado", cat: "Religioso", preco: 5, c1: "#cfe1f2", c2: "#7ea8be", topo: "🕊️" },
  { id: 13, slug: "festa-junina", nome: "Topo de Bolo Festa Junina", cat: "Datas", preco: 6, c1: "#ffb703", c2: "#fb8500", topo: "🌽" },
  { id: 14, slug: "natal", nome: "Topo de Bolo Natal", cat: "Datas", preco: 5, c1: "#e5989b", c2: "#c1121f", topo: "🎄" },
  { id: 15, slug: "safari-selva", nome: "Topo de Bolo Safari / Selva", cat: "Meninos", preco: 7, c1: "#d4e09b", c2: "#a3b18a", topo: "🦁" },
  { id: 16, slug: "bailarina", nome: "Topo de Bolo Bailarina", cat: "Meninas", preco: 5, c1: "#ffcad4", c2: "#ee6c9a", topo: "🩰" },
];

/** Categorias mostradas no filtro (a contagem é calculada automaticamente) */
export const CATEGORIAS = [
  "Meninas",
  "Meninos",
  "Chá de Bebê",
  "Páscoa",
  "Formatura",
  "Religioso",
  "Datas",
  "Diversos",
] as const;
