"use client";

import { useState } from "react";
import { GalleryLightbox } from "@/components/gallery/lightbox";

interface ImageGridItem {
  src: string;
  alt?: string;
}

interface ImageGridBlockProps {
  id?: string;
  images: ImageGridItem[];
}

export function ImageGridBlock({ id, images }: ImageGridBlockProps) {
  const count = images.length;
  const cls = `igb-${count}`;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((img) => ({ src: img.src, alt: img.alt }));

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  return (
    <section
      id={id}
      className={`${cls} h-[calc(100vh-3.5rem)] snap-start shrink-0 overflow-hidden`}
    >
      <style>{`
        .${cls} {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: repeat(${count}, 1fr);
        }
        @media (min-width: 768px) {
          .${cls} {
            grid-template-columns: repeat(${count}, 1fr);
            grid-template-rows: 1fr;
          }
        }
      `}</style>
      {images.map((img, i) => (
        <button
          key={i}
          onClick={() => openAt(i)}
          className="relative overflow-hidden group focus:outline-none"
        >
          <img
            src={img.src}
            alt={img.alt ?? ""}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </button>
      ))}

      <GalleryLightbox
        open={open}
        index={index}
        slides={slides}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
