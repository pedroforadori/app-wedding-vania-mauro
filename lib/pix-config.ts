import "server-only";

// Os 5 formatos de chave Pix aceitos pelo DICT do Banco Central — ver
// .env.example para os exemplos. Validar contra isso evita que um placeholder
// (ex.: um valor mascarado tipo "[SENSITIVE]" colado por engano na env var)
// vire silenciosamente um QR Code "bem-formado" só que com destinatário
// inexistente, algo que o app da pessoa que paga só vai acusar como inválido.
const CPF_REGEX = /^\d{11}$/;
const CNPJ_REGEX = /^\d{14}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+55\d{10,11}$/;
const RANDOM_KEY_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidPixKey(key: string): boolean {
  return (
    CPF_REGEX.test(key) ||
    CNPJ_REGEX.test(key) ||
    EMAIL_REGEX.test(key) ||
    PHONE_REGEX.test(key) ||
    RANDOM_KEY_REGEX.test(key)
  );
}

export function isPixConfigured(): boolean {
  const key = process.env.PIX_KEY?.trim();
  return Boolean(
    key &&
      isValidPixKey(key) &&
      process.env.PIX_MERCHANT_NAME?.trim() &&
      process.env.PIX_MERCHANT_CITY?.trim()
  );
}

export function getPixConfig() {
  if (!isPixConfigured()) {
    throw new Error(
      "Pix não configurado: defina PIX_KEY (CPF, CNPJ, e-mail, celular no formato +55DDDNUMERO ou chave aleatória válidos), PIX_MERCHANT_NAME e PIX_MERCHANT_CITY."
    );
  }
  return {
    key: process.env.PIX_KEY!.trim(),
    merchantName: process.env.PIX_MERCHANT_NAME!,
    merchantCity: process.env.PIX_MERCHANT_CITY!,
  };
}
