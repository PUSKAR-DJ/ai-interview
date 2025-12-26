import { GlassPanel, Button } from "../../shared/ui";

export default function Products() {
  return (
    <section id="products" className="py-24 bg-white/50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-12">Products</h2>

        <GlassPanel className="max-w-xl p-6">
          <h3 className="text-xl font-medium">AI Interview Platform</h3>

          <p className="mt-3 text-muted">
            A focused interview environment designed for fairness, consistency, and clarity.
          </p>

          <div className="mt-6">
            <Button variant="ghost">
              Open app →
            </Button>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
