import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NotFoundLogger } from "@/components/layout/NotFoundLogger";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden pt-40 pb-28">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" aria-hidden />
      <NotFoundLogger />
      <Container className="max-w-2xl text-center">
        <p className="text-gradient text-8xl font-extrabold">404</p>
        <h1 className="mt-6 text-4xl font-extrabold text-charcoal-900">This page has lost its momentum</h1>
        <p className="mt-4 text-lg text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Button href="/services" variant="ghost">
            View our services
          </Button>
        </div>
      </Container>
    </section>
  );
}
