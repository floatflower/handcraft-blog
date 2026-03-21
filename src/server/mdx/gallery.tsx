"use client";

import { useState } from "react";
import { GalleryLightbox } from "@/components/gallery/lightbox";

interface GalleryImage {
  url: string;
  alt?: string;
  description?: string;
}

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((img) => ({
    src: img.url,
    alt: img.alt,
    description: img.description,
  }));

  return (
    <>
      <div className="grid grid-cols-3 gap-2 my-6">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="aspect-square overflow-hidden rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img
              src={img.url}
              alt={img.alt ?? ""}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
            />
          </button>
        ))}
      </div>

      <GalleryLightbox
        open={open}
        index={index}
        slides={slides}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
