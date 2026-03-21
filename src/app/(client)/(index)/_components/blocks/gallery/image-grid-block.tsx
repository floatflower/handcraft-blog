interface ImageGridItem {
  src: string;
  alt?: string;
}

interface ImageGridBlockProps {
  images: ImageGridItem[];
}

export function ImageGridBlock({ images }: ImageGridBlockProps) {
  return (
    <section
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 overflow-hidden"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${images.length}, 1fr)`,
      }}
    >
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
