import { GlassPanel, Button } from "../../shared/ui";

export default function Careers() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <GlassPanel className="p-8">
          <h2 className="text-2xl font-semibold">Careers</h2>

          <p className="mt-3 text-muted">
            We’re always interested in thoughtful builders. If that sounds like you, let’s talk.
          </p>

          <div className="mt-6">
            <Button variant="ghost">
              Get in touch →
            </Button>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
