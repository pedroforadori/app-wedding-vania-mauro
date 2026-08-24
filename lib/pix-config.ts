import "server-only";

export function isPixConfigured(): boolean {
  return Boolean(
    process.env.PIX_KEY?.trim() &&
      process.env.PIX_MERCHANT_NAME?.trim() &&
      process.env.PIX_MERCHANT_CITY?.trim()
  );
}

export function getPixConfig() {
  if (!isPixConfigured()) {
    throw new Error(
      "Pix não configurado: defina PIX_KEY, PIX_MERCHANT_NAME e PIX_MERCHANT_CITY."
    );
  }
  return {
    key: process.env.PIX_KEY!,
    merchantName: process.env.PIX_MERCHANT_NAME!,
    merchantCity: process.env.PIX_MERCHANT_CITY!,
  };
}
