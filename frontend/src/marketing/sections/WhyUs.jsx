const points = [
  "Calm, distraction-free experiences",
  "Consistent evaluation processes",
  "Built for long-term scalability",
];

export default function WhyUs() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-8">Why teams choose us</h2>
        <ul className="space-y-4 text-lg text-muted">
          {points.map((p) => (
            <li key={p}>— {p}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
