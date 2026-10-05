import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Markdown } from "@/components/ui/Markdown";
import { MediaImage } from "@/components/ui/MediaImage";
import { getSite } from "@/lib/data";
import { mediaUrl, siteUrl } from "@/lib/site";

export async function generateStaticParams() {
  return (await getSite()).posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getSite()).posts.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.excerpt,
    openGraph: { type: "article", publishedTime: p.date, ...(p.cover ? { images: [mediaUrl(p.cover)] } : {}) },
  };
}

export default async function PostPage({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const { posts, settings } = await getSite();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const related = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`${post.category} · ${post.readMins ?? 4} min read`}
        title={post.title}
        text={post.excerpt}
        crumbs={[{ label: "Resources", href: "/resources" }, { label: post.title }]}
      />
      <article className="pb-16">
        <Container className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="max-w-2xl">
            {post.cover && (
              <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl">
                <MediaImage id={post.cover} alt="" sizes="(min-width: 1024px) 672px, 100vw" priority />
              </div>
            )}
            <p className="mb-8 text-sm text-muted">
              By {post.author ?? settings.businessName} ·{" "}
              {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <Markdown>{post.body}</Markdown>
            <p className="mt-10 rounded-2xl bg-stone-100 p-5 text-base text-muted">
              This article is general guidance, not personal tax advice. Speak to us about your own circumstances.
            </p>
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-charcoal-900 p-7 text-white">
              <p className="text-xl font-bold">Want advice for your business?</p>
              <p className="mt-2 text-white/65">Book a free introductory call with our team.</p>
              <Button href="/book-a-call" className="mt-6 w-full">
                Book a call
              </Button>
            </div>
            {related.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold tracking-wide text-muted uppercase">Related</p>
                <ul className="mt-3 space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/resources/${r.slug}`} className="font-semibold text-charcoal-900 hover:text-teal-ink">
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </Container>
      </article>
      <CtaBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: { "@type": "Organization", name: post.author ?? settings.businessName },
          publisher: { "@type": "Organization", name: settings.legalName, url: siteUrl },
          mainEntityOfPage: `${siteUrl}/resources/${post.slug}`,
        }}
      />
    </>
  );
}
