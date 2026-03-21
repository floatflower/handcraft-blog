interface BentoGalleryItem {
  src: string;
  alt?: string;
  label?: string;
}

interface BentoGalleryBlockProps {
  /**
   * Expects exactly 5 images laid out as:
   *
   *  ┌───────────┬──────┐
   *  │     1     │  2   │
   *  │ (col×2)   │      │
   *  ├──────┬────┴──────┤
   *  │  3   │     4     │
   *  │      │  (col×2)  │
   *  ├──────┴──────┬────┤
   *  │      5      │ (hidden on sm) │
   *  └─────────────┘
   *
   * On mobile collapses to a 2-col grid.
   */
  images: [
    BentoGalleryItem,
    BentoGalleryItem,
    BentoGalleryItem,
    BentoGalleryItem,
    BentoGalleryItem,
  ];
  label?: string;
}

export function BentoGalleryBlock({ images, label }: BentoGalleryBlockProps) {
  const [img1, img2, img3, img4, img5] = images;

  return (
    <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 overflow-hidden p-3 bg-background">
      <div
        className="h-full grid gap-2"
        style={{
          gridTemplateColumns: "2fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gridTemplateAreas: `
            "a a b"
            "c d d"
          `,
        }}
      >
        {/* 1 — wide top-left */}
        <BentoCell image={img1} area="a" />
        {/* 2 — top-right */}
        <BentoCell image={img2} area="b" />
        {/* 3 — bottom-left */}
        <BentoCell image={img3} area="c" />
        {/* 4 — wide bottom-right */}
        <BentoCell image={img4} area="d" />
      </div>
    </section>
  );
}

function BentoCell({ image, area }: { image: BentoGalleryItem; area: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl group"
      style={{ gridArea: area }}
    >
      <img
        src={image.src}
        alt={image.alt ?? ""}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {image.label && (
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-[10px] tracking-widest uppercase text-white/60 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {image.label}
          </span>
        </div>
      )}
    </div>
  );
}
