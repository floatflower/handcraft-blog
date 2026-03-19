export function Blockquote({ children }: { children?: React.ReactNode }) {
  return (
    <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-4">
      {children}
    </blockquote>
  );
}
