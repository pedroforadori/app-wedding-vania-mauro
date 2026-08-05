import {
  WEDDING_DATE_ISO,
  WEDDING_DRESS_CODE,
  WEDDING_VENUE_ADDRESS,
  WEDDING_VENUE_MAPS_URL,
  WEDDING_VENUE_NAME,
} from "@/lib/constants";
import { formatWeddingDate, formatWeddingTime } from "@/lib/format";

const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });

function formatWeekday(isoDate: string): string {
  const weekday = weekdayFormatter.format(new Date(isoDate));
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5"
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5"
    >
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5"
    >
      <path
        d="M12 3.5c.6 3.2 1.3 4.4 4.5 5-3.2.6-4.4 1.3-5 4.5-.6-3.2-1.3-4.4-4.5-5 3.2-.6 4.4-1.3 5-4.5Z"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 14c.3 1.7.7 2.3 2.5 2.5-1.8.3-2.3.7-2.5 2.5-.3-1.8-.7-2.3-2.5-2.5 1.8-.3 2.3-.7 2.5-2.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PartySection() {
  return (
    <section id="sobre-a-festa" className="scroll-mt-24 bg-muted">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center md:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">
          Sobre a Festa
        </p>
        <h2 className="mt-4 font-serif text-3xl text-secondary md:text-4xl">
          Tudo o que você precisa saber para celebrar com a gente
        </h2>

        <div className="mx-auto mt-10 max-w-md space-y-6">
          <div>
            <div className="flex items-center justify-center gap-2 text-accent">
              <CalendarIcon />
              <p className="text-sm uppercase tracking-wide text-secondary">
                Quando
              </p>
            </div>
            <p className="mt-2 text-base text-muted-foreground">
              {formatWeddingDate(WEDDING_DATE_ISO)} ·{" "}
              {formatWeekday(WEDDING_DATE_ISO)}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 text-accent">
              <PinIcon />
              <p className="text-sm uppercase tracking-wide text-secondary">
                Onde
              </p>
            </div>
            <p className="mt-2 text-base text-muted-foreground">
              {WEDDING_VENUE_NAME} — {WEDDING_VENUE_ADDRESS}
            </p>
            <a
              href={WEDDING_VENUE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-secondary"
            >
              Ver no mapa
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 text-accent">
              <ClockIcon />
              <p className="text-sm uppercase tracking-wide text-secondary">
                Horário
              </p>
            </div>
            <p className="mt-2 text-base text-muted-foreground">
              A cerimônia começa às {formatWeddingTime(WEDDING_DATE_ISO)}.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 text-accent">
              <SparkleIcon />
              <p className="text-sm uppercase tracking-wide text-secondary">
                Dress Code
              </p>
            </div>
            <p className="mt-2 text-base text-muted-foreground">
              {WEDDING_DRESS_CODE} — capriche no look e escolha um sapato
              confortável, a noite vai ser de festa!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
