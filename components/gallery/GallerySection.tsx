import Image from "next/image";

const photos = [
  {
    id: "1519741497674-611481863552",
    alt: "Alianças de casamento",
  },
  {
    id: "1606216794074-735e91aa2c92",
    alt: "Mãos dadas dos noivos",
  },
  {
    id: "1511285560929-80b456fea0bc",
    alt: "Casal se abraçando",
  },
  {
    id: "1519225421980-715cb0215aed",
    alt: "Buquê da noiva",
  },
  {
    id: "1519167758481-83f550bb49b3",
    alt: "Mesa decorada para a celebração",
  },
  {
    id: "1518733057094-95b53143d2a7",
    alt: "Refúgio no interior para o casal",
  },
  {
    id: "1510812431401-41d2bd2722f3",
    alt: "Brinde a dois",
  },
  {
    id: "1436491865332-7a61a109cc05",
    alt: "Aventuras a dois pela estrada",
  },
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
            Momentos que contam nossa história
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
                src={`https://images.unsplash.com/photo-${photo.id}?q=80&w=800&auto=format&fit=crop`}
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
