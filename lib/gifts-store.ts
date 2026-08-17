import "server-only";
import type { Gift } from "@/types/gift";

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`;
}

const gifts: Gift[] = [
  {
    id: "cafe-da-manha",
    title: "Café da manhã especial em uma padaria tradicional",
    description:
      "Um começo de dia gostoso, com pão quentinho, café coado e aquela conversa boa antes da correria.",
    price: 10000,
    imageUrl: unsplash("1509440159596-0249088772ff"),
  },
  {
    id: "piquenique-parque",
    title: "Piquenique em um parque",
    description:
      "Uma tarde ao ar livre, manta no chão, cesta cheia e tempo de sobra um para o outro.",
    price: 15000,
    imageUrl: unsplash("1470337458703-46ad1756a187"),
  },
  {
    id: "cinema-jantar",
    title: "Sessão de cinema com jantar",
    description:
      "Um encontro clássico: telão grande, pipoca e um jantar tranquilo para fechar a noite.",
    price: 20000,
    imageUrl: unsplash("1440404653325-ab127d49abc1"),
  },
  {
    id: "degustacao-vinhos",
    title: "Degustação de vinhos",
    description:
      "Uma tarde para conhecer rótulos novos, aprender um pouco mais sobre vinhos e brindar juntos.",
    price: 25000,
    imageUrl: unsplash("1506377247377-2a5b3b417ebb"),
  },
  {
    id: "jantar-italiano",
    title: "Jantar em um restaurante italiano",
    description:
      "Massas, molhos de dar água na boca e aquele clima aconchegante de trattoria.",
    price: 30000,
    imageUrl: unsplash("1498654896293-37aacf113fd9"),
  },
  {
    id: "aula-culinaria",
    title: "Aula de culinária para casais",
    description:
      "Mãos na massa, literalmente — uma experiência divertida para aprender receitas novas a dois.",
    price: 35000,
    imageUrl: unsplash("1556909114-44e3e70034e2"),
  },
  {
    id: "massagem-casal",
    title: "Massagem relaxante para o casal",
    description:
      "Uma pausa para relaxar juntos, com aquele cuidado que o corpo (e a mente) pede de vez em quando.",
    price: 40000,
    imageUrl: unsplash("1544161515-4ab6ce6db874"),
  },
  {
    id: "dia-de-spa",
    title: "Dia de spa",
    description:
      "Um dia inteiro dedicado ao descanso, aos cuidados e à tranquilidade em dose dupla.",
    price: 45000,
    imageUrl: unsplash("1540555700478-4be289fbecef"),
  },
  {
    id: "passeio-de-barco",
    title: "Passeio de barco",
    description:
      "Sol, água e horizonte — um passeio para curtir a paisagem e a companhia um do outro.",
    price: 50000,
    imageUrl: unsplash("1544551763-46a013bb70d5"),
  },
  {
    id: "fds-pousada",
    title: "Fim de semana em uma pousada",
    description:
      "Dois dias de descanso longe da rotina, em um cantinho tranquilo só para os dois.",
    price: 60000,
    imageUrl: unsplash("1499793983690-e29da59ef1c2"),
  },
  {
    id: "passeio-balao",
    title: "Passeio de balão",
    description:
      "Uma vista de tirar o fôlego, ao nascer do sol, para começar um novo capítulo lá do alto.",
    price: 70000,
    imageUrl: unsplash("1507608616759-54f48f0af0ee"),
  },
  {
    id: "show-espetaculo",
    title: "Show ou espetáculo",
    description:
      "Música, luzes e emoção ao vivo — uma noite para guardar na memória.",
    price: 80000,
    imageUrl: unsplash("1493676304819-0d7a8d026dcf"),
  },
  {
    id: "jantar-premiado",
    title: "Jantar em um restaurante premiado",
    description:
      "Uma experiência gastronômica à altura da ocasião, com direito a menu especial e boas lembranças.",
    price: 90000,
    imageUrl: unsplash("1414235077428-338989a2e8c0"),
  },
  {
    id: "hotel-boutique",
    title: "Diária em um hotel boutique",
    description:
      "Uma noite em um lugar com personalidade própria, conforto e muito charme.",
    price: 100000,
    imageUrl: unsplash("1611892440504-42a792e24d32"),
  },
  {
    id: "viagem-surpresa",
    title: "Viagem surpresa de fim de semana",
    description:
      "Malas prontas, destino em segredo — uma escapadinha surpresa para viver juntos.",
    price: 100000,
    imageUrl: unsplash("1488646953014-85cb44e25828"),
  },
];

export async function getGifts(): Promise<Gift[]> {
  return gifts;
}

export async function getGiftById(id: string): Promise<Gift | undefined> {
  return gifts.find((gift) => gift.id === id);
}
