import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

/**
 * Cliente Stripe.js pronto para uso futuro (ex.: Payment Element embutido).
 * O fluxo de checkout atual redireciona direto para a Checkout Session URL
 * retornada pelo servidor, sem precisar deste cliente.
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
    );
  }
  return stripePromise;
}
