import { COUPLE_NAMES, WEDDING_DATE_ISO } from "@/lib/constants";
import { formatWeddingDate } from "@/lib/format";
import Countdown from "./Countdown";
import HeroBackground from "./HeroBackground";

export default function Hero() {
  return (
    <div className="relative flex min-h-screen items-end overflow-hidden">
      <HeroBackground />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-secondary/10" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-40 text-center text-primary md:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
          Vamos nos casar
        </p>
        <h1 className="mt-4 font-script text-6xl leading-tight text-ivory md:text-8xl">
          {COUPLE_NAMES}
        </h1>
        <p className="mt-4 text-sm uppercase tracking-widest text-primary/80 md:text-base">
          {formatWeddingDate(WEDDING_DATE_ISO)}
        </p>

        <div className="mt-10">
          <Countdown targetDate={WEDDING_DATE_ISO} />
        </div>
      </div>
    </div>
  );
}
