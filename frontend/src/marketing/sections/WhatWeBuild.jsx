import { GlassPanel } from "../../shared/ui";

const items = [
  {
    title: "Hiring Infrastructure",
    desc: "Reliable systems that scale with your hiring needs.",
  },
  {
    title: "Candidate Experience",
    desc: "Respectful, focused experiences for every applicant.",
  },
  {
    title: "Decision Intelligence",
    desc: "Clear signals that support better judgment.",
  },
];

export default function WhatWeBuild() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-12">What we build</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item) => (
            <GlassPanel key={item.title} className="p-6">
              <h3 className="font-medium text-lg">{item.title}</h3>
              <p className="mt-3 text-muted leading-relaxed">{item.desc}</p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
