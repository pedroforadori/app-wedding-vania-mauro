import Image from "next/image";

export default function StoryPhoto() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 md:px-10">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl md:aspect-[21/9]">
        <Image
          src="/images/history.jpg"
          alt="Vania e Mauro"
          fill
          sizes="(min-width: 768px) 80vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
