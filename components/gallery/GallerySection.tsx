import GalleryGrid from "@/components/gallery/GalleryGrid";

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

        <GalleryGrid />
      </div>
    </section>
  );
}
