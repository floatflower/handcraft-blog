export function Pre({ children }: { children?: React.ReactNode }) {
  return (
    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm font-mono mb-4">
      {children}
    </pre>
  );
}
