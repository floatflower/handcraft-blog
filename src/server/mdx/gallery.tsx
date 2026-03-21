"use client";

import { useState } from "react";
import type React from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

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

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Captions, Fullscreen, Thumbnails, Zoom]}
        thumbnails={{ position: "bottom", width: 64, height: 64, gap: 8 }}
        styles={{
          // @ts-ignore
          root: {
            "--yarl__color_backdrop": "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(12px)",
          } as React.CSSProperties,
        }}
      />
    </>
  );
}
