export function H3({ children, id }: { children?: React.ReactNode; id?: string }) {
  return <h3 id={id} className="text-xl font-semibold mt-6 mb-2">{children}</h3>;
}
