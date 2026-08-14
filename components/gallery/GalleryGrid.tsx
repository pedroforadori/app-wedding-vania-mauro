"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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

const photoSrc = (id: string) => `/images/galery-${id}.jpeg`;

const slides = photos.map((photo) => ({
  src: photoSrc(photo.id),
  alt: photo.alt,
  width: 1600,
  height: 1066,
}));

export default function GalleryGrid() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            aria-label={`Ampliar foto: ${photo.alt}`}
            className="relative overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            style={{ aspectRatio: "4 / 3" }}
          >
            <Image
              src={photoSrc(photo.id)}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex !== null}
        close={() => setLightboxIndex(null)}
        index={lightboxIndex ?? 0}
        slides={slides}
      />
    </>
  );
}
