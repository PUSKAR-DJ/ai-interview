export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-black/5 bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}
