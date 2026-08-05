import { Suspense } from "react";
import { getGifts } from "@/lib/gifts-store";
import GiftGrid from "./GiftGrid";
import GiftsSkeleton from "./GiftsSkeleton";

export default function GiftListSection() {
  const giftsPromise = getGifts();

  return (
    <section id="lista-de-presentes" className="scroll-mt-24 bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl text-secondary md:text-4xl">
            Lista de Presentes – Experiências para Nossa Vida a Dois
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            Acreditamos que as melhores lembranças são construídas com
            momentos. Por isso, nossa lista de presentes é composta por
            experiências que queremos viver ao longo da nossa vida de
            casados. Obrigado por fazer parte dessa nova etapa!
          </p>
        </div>

        <div className="mt-14">
          <Suspense fallback={<GiftsSkeleton />}>
            <GiftGrid giftsPromise={giftsPromise} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
