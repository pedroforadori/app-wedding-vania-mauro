/**
 * Gerador do payload EMV "Pix Copia e Cola" (BR Code), seguindo o manual de
 * padrões para iniciação do Pix do Banco Central. Sem dependências externas.
 *
 * CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF, sem reflexão, sem XOR-out)
 * validado contra o exemplo publicado pelo Bacen:
 *   000201 26580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000
 *   52040000 5303986 5802BR 5913Fulano de Tal 6008BRASILIA 62070503*** 6304
 * fecha com CRC "1D3D" — qualquer alteração no algoritmo deve continuar
 * reproduzindo esse valor para o mesmo payload.
 */

function tlv(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

/**
 * Normaliza nome/cidade do recebedor para o ASCII simples exigido pelo
 * padrão (as env vars podem ter sido digitadas com acento).
 */
export function sanitizePixText(input: string, maxLength: number): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // marcas diacríticas (acentos) da forma decomposta NFD
    .replace(/[^\x20-\x7E]/g, "")
    .toUpperCase()
    .trim()
    .slice(0, maxLength);
}

function sanitizeTxid(input: string, maxLength = 25): string {
  const cleaned = input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return (cleaned || "PIX").slice(0, maxLength);
}

function crc16ccitt(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export interface BuildPixPayloadInput {
  key: string;
  merchantName: string;
  merchantCity: string;
  /** Centavos. */
  amountCents: number;
  txid: string;
}

export function buildPixPayload(input: BuildPixPayloadInput): string {
  const merchantName = sanitizePixText(input.merchantName, 25);
  const merchantCity = sanitizePixText(input.merchantCity, 15);
  if (!merchantName || !merchantCity) {
    throw new Error(
      "PIX_MERCHANT_NAME/PIX_MERCHANT_CITY resultaram vazios após sanitização."
    );
  }
  // A chave precisa ficar byte-exata — não passa pela sanitização acima.
  if (/[^\x00-\x7f]/.test(input.key)) {
    throw new Error("PIX_KEY contém caracteres não-ASCII.");
  }

  const txid = sanitizeTxid(input.txid);
  const reais = Math.floor(input.amountCents / 100);
  const centavos = input.amountCents % 100;
  const amount = `${reais}.${String(centavos).padStart(2, "0")}`;

  // Sem subcampo "02" (descrição): já perto do limite de 99 chars do campo 26
  // com chaves do tipo e-mail, e um estouro silencioso corromperia o payload.
  const merchantAccount = tlv("00", "br.gov.bcb.pix") + tlv("01", input.key);

  const payloadNoCrc =
    tlv("00", "01") +
    tlv("26", merchantAccount) +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", amount) +
    tlv("58", "BR") +
    tlv("59", merchantName) +
    tlv("60", merchantCity) +
    tlv("62", tlv("05", txid)) +
    "6304";

  return payloadNoCrc + crc16ccitt(payloadNoCrc);
}
