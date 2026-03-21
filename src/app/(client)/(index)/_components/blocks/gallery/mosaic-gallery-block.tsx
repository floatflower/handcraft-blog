interface MosaicGalleryItem {
  src: string;
  alt?: string;
}

interface MosaicGalleryBlockProps {
  /** Expects exactly 3 images: [large, top-right, bottom-right] */
  images: [MosaicGalleryItem, MosaicGalleryItem, MosaicGalleryItem];
  caption?: string;
}

export function MosaicGalleryBlock({
  images,
  caption,
}: MosaicGalleryBlockProps) {
  const [large, topRight, bottomRight] = images;

  return (
    <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 grid grid-cols-3 grid-rows-2 overflow-hidden">
      {/* Large image — spans 2 cols, full height */}
      <div className="col-span-2 row-span-2 relative overflow-hidden group">
        <img
          src={large.src}
          alt={large.alt ?? ""}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {caption && (
          <div className="absolute bottom-6 left-6 z-10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/60">
              {caption}
            </p>
          </div>
        )}
      </div>

      {/* Top-right */}
      <div className="relative overflow-hidden group border-l border-b border-background/20">
        <img
          src={topRight.src}
          alt={topRight.alt ?? ""}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Bottom-right */}
      <div className="relative overflow-hidden group border-l border-background/20">
        <img
          src={bottomRight.src}
          alt={bottomRight.alt ?? ""}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    </section>
  );
}
