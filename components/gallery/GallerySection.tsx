import Image from "next/image";

const photos = [
  { id: "1", alt: "Momento do casal 1" },
  { id: "2", alt: "Momento do casal 2" },
  { id: "3", alt: "Momento do casal 3" },
  { id: "4", alt: "Momento do casal 4" },
  { id: "5", alt: "Momento do casal 5" },
  { id: "6", alt: "Momento do casal 6" },
  { id: "7", alt: "Momento do casal 7" },
  { id: "8", alt: "Momento do casal 8" },
  { id: "9", alt: "Momento do casal 9" },
];

export default function GallerySection() {
  return (
    <section id="galeria" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            Galeria
          </p>
          <h2 className="mt-4 font-serif text-3xl text-secondary md:text-4xl">
            Um clique do que está por vir
          </h2>
        </div>

        <div className="mt-12 columns-2 gap-4 md:columns-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative mb-4 break-inside-avoid overflow-hidden rounded-xl"
              style={{ aspectRatio: index % 3 === 0 ? "3 / 4" : "1 / 1" }}
            >
              <Image
                src={`/images/galery-${photo.id}.jpeg`}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
