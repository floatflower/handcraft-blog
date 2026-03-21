interface FocusGalleryItem {
  src: string;
  alt?: string;
}

interface FocusGalleryBlockProps {
  /** First image is the large hero; rest become the thumbnail strip (max 4) */
  images: [FocusGalleryItem, ...FocusGalleryItem[]];
  label?: string;
  title?: string;
}

export function FocusGalleryBlock({
  images,
  label,
  title,
}: FocusGalleryBlockProps) {
  const [hero, ...thumbnails] = images;
  const thumbs = thumbnails.slice(0, 4);

  return (
    <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 flex overflow-hidden">
      {/* Hero image */}
      <div className="relative flex-1 overflow-hidden group">
        <img
          src={hero.src}
          alt={hero.alt ?? ""}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {(label || title) && (
          <div className="absolute bottom-8 left-8 z-10">
            {label && (
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-1">
                {label}
              </p>
            )}
            {title && (
              <p className="text-lg font-black text-white tracking-tight">
                {title}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {thumbs.length > 0 && (
        <div className="w-28 sm:w-36 flex flex-col border-l border-border">
          {thumbs.map((img, i) => (
            <div
              key={i}
              className="relative flex-1 overflow-hidden group border-b border-border last:border-b-0"
            >
              <img
                src={img.src}
                alt={img.alt ?? ""}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
