import { PageHero } from "@/components/layout/page-hero";
import { Container, Section } from "@/components/layout/container";
import { UnsubscribeForm } from "@/components/sections/unsubscribe-form";

export const metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from the Indian Sports Club newsletter.",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Newsletter"
        title="Unsubscribe"
        description="Enter your email to stop receiving the newsletter. No hard feelings — you can come back anytime."
        crumbs={[{ label: "Home", href: "/" }, { label: "Unsubscribe" }]}
      />
      <Section>
        <Container size="narrow">
          <UnsubscribeForm defaultEmail={email} />
        </Container>
      </Section>
    </>
  );
}
