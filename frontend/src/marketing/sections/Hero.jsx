import { Button } from "../../shared/ui";

export default function Hero() {
  return (
    <section className="pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-semibold leading-tight max-w-3xl">
          Thoughtful tools for modern hiring.
        </h1>

        <p className="mt-6 text-lg text-muted max-w-2xl">
          We build calm, reliable systems that help teams make better hiring decisions—at scale.
        </p>

        <div className="mt-10 flex gap-4">
          <Button>
            Explore products
          </Button>

          <Button variant="secondary">
            Talk to us
          </Button>
        </div>
      </div>
    </section>
  );
}
