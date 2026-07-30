import RsvpForm from "./RsvpForm";

export default function RsvpSection() {
  return (
    <section id="confirme-sua-presenca" className="scroll-mt-24">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center md:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">
          RSVP
        </p>
        <h2 className="mt-4 font-serif text-3xl text-secondary md:text-4xl">
          Confirme sua Presença
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Sua presença é o presente mais importante para nós. Preencha os
          dados abaixo para confirmar que estará com a gente nesse dia.
        </p>

        <RsvpForm />
      </div>
    </section>
  );
}
