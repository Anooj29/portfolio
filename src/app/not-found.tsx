import { ButtonLink } from "@/components/ui/Button";
import { ArrowLeft } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <section className="blueprint grid min-h-[80vh] place-items-center px-5 pt-16 text-center">
      <div>
        <p className="label mb-4">Error 404 · Out of workspace</p>
        <h1 className="font-display text-6xl font-semibold tracking-tight md:text-8xl">Target unreachable.</h1>
        <p className="mx-auto mt-5 max-w-md text-fg-muted">The page you&apos;re looking for is outside this robot&apos;s reach envelope.</p>
        <ButtonLink href="/" className="mt-10">
          <ArrowLeft /> Return home
        </ButtonLink>
      </div>
    </section>
  );
}
