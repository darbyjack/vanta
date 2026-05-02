import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-12">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold">Not found</h1>
        <p className="mt-3 text-muted-foreground">The TMDB item you are looking for does not exist or is unavailable.</p>
        <Button asChild className="mt-6">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </Container>
  );
}
