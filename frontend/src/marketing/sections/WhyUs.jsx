const points = [
  "Calm, distraction-free experiences",
  "Consistent evaluation processes",
  "Built for long-term scalability",
];

export default function WhyUs() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8">Why teams choose us</h2>
        <ul className="space-y-4 text-base md:text-lg text-muted">
          {points.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="text-accent">—</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
