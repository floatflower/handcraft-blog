export function Table({ children }: { children?: React.ReactNode }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  );
}

export function Thead({ children }: { children?: React.ReactNode }) {
  return <thead className="border-b border-border">{children}</thead>;
}

export function Tbody({ children }: { children?: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ children }: { children?: React.ReactNode }) {
  return <tr className="odd:bg-muted/40">{children}</tr>;
}

export function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-4 py-2 text-left font-semibold text-foreground">{children}</th>
  );
}

export function Td({ children }: { children?: React.ReactNode }) {
  return <td className="px-4 py-2 text-foreground/80">{children}</td>;
}
