export function Ol({ children }: { children?: React.ReactNode }) {
  return (
    <ol className="list-decimal pl-6 mb-4 space-y-1 text-foreground/80">
      {children}
    </ol>
  );
}
