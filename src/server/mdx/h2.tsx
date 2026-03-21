export function H2({
  children,
  id,
}: {
  children?: React.ReactNode;
  id?: string;
}) {
  return (
    <h2 id={id} className="text-2xl font-semibold mt-8 mb-3">
      {children}
    </h2>
  );
}
