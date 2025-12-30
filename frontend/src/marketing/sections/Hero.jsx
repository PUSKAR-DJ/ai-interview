import { Button } from "../../shared/ui";

export default function Hero() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-3xl">
          Thoughtful tools for modern hiring.
        </h1>

        <p className="mt-6 text-base md:text-lg text-muted max-w-2xl leading-relaxed">
          We build calm, reliable systems that help teams make better hiring decisions—at scale.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button className="w-full sm:w-auto justify-center md:px-8">
            Explore products
          </Button>

          <Button variant="secondary" className="w-full sm:w-auto justify-center md:px-8">
            Talk to us
          </Button>
        </div>
      </div>
    </section>
  );
}
