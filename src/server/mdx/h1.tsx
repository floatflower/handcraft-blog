export function H1({
  children,
  id,
}: {
  children?: React.ReactNode;
  id?: string;
}) {
  return (
    <h1 id={id} className="text-3xl font-bold mt-10 mb-4">
      {children}
    </h1>
  );
}
