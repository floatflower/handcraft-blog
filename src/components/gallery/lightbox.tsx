"use client";

import type React from "react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export interface LightboxSlide {
  src: string;
  alt?: string;
  description?: string;
}

interface GalleryLightboxProps {
  open: boolean;
  index: number;
  slides: LightboxSlide[];
  onClose: () => void;
}

export function GalleryLightbox({
  open,
  index,
  slides,
  onClose,
}: GalleryLightboxProps) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Fullscreen, Thumbnails, Zoom]}
      thumbnails={{ position: "bottom", width: 64, height: 64, gap: 8 }}
      styles={{
        // @ts-ignore
        root: {
          "--yarl__color_backdrop": "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(12px)",
        } as React.CSSProperties,
      }}
    />
  );
}
