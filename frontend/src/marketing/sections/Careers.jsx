import { GlassPanel, Button } from "../../shared/ui";

export default function Careers() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        <GlassPanel className="p-6 md:p-10">
          <h2 className="text-xl md:text-3xl font-semibold">Careers</h2>

          <p className="mt-4 text-muted leading-relaxed text-sm md:text-base">
            We’re always interested in thoughtful builders. If that sounds like you, let’s talk.
          </p>

          <div className="mt-8">
            <Button variant="ghost" className="pl-0 text-accent font-semibold flex items-center gap-2">
              Get in touch <span className="text-lg">→</span>
            </Button>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
