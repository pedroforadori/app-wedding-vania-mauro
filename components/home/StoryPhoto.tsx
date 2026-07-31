import Image from "next/image";

export default function StoryPhoto() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 md:px-10">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl md:aspect-[21/9]">
        <Image
          src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1920&auto=format&fit=crop"
          alt="Vania e Mauro"
          fill
          sizes="(min-width: 768px) 80vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
