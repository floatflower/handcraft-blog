interface ImageGridItem {
  src: string;
  alt?: string;
}

interface ImageGridBlockProps {
  images: ImageGridItem[];
}

export function ImageGridBlock({ images }: ImageGridBlockProps) {
  const count = images.length;
  const cls = `igb-${count}`;
  return (
    <section
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
        <div key={i} className="relative overflow-hidden group">
          <img
            src={img.src}
            alt={img.alt ?? ""}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ))}
    </section>
  );
}
