import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/server/mdx";
import { postLoader } from "@/server/post-loader";
import { get } from "lodash";
import dayjs from "dayjs";
import { TableOfContents, type Heading } from "./_components/table-of-contents";
import { Navbar } from "@/components/navbar";

type Params = Promise<{ slug: string[] }>;

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]/g, "");
}

function nodeToText(node: any): string {
  if (node.type === "text") return node.value;
  return (node.children ?? []).map(nodeToText).join("");
}

function rehypeAddHeadingIds() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === "element" && ["h1", "h2", "h3"].includes(node.tagName)) {
        const text = nodeToText(node);
        node.properties ??= {};
        node.properties.id = slugify(text);
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    headings.push({ level, text, id: slugify(text) });
  }
  return headings;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");

  const posts = postLoader();
  const post = posts.find((p) => p.slug === slugPath);
  if (!post) return {};

  const { metadata: meta } = post;
  return {
    title: meta.title,
    description: meta.excerpt,
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      ...(get(meta, "coverImage.url") && {
        images: [{ url: `${process.env.NEXT_PUBLIC_APP_URL}${get(meta, "coverImage.url")}`, alt: get(meta, "coverImage.alt") }],
      }),
      siteName: "Handcraft",
      type: "article",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/posts/${slugPath}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = postLoader();
  return posts.map((p) => ({ slug: p.slug.split("/") }));
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  const posts = postLoader();
  const post = posts.find((p) => p.slug === slugPath);
  if (!post) notFound();

  const { metadata: meta, content } = post;
  const { default: Content } = await evaluate(content, {
    ...runtime,
    baseUrl: import.meta.url,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeAddHeadingIds],
  });

  const headings = extractHeadings(content);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.excerpt,
    url: `${baseUrl}/posts/${slugPath}`,
    ...(get(meta, "coverImage.url") && {
      image: `${baseUrl}${get(meta, "coverImage.url")}`,
    }),
    ...(meta.createdAt && { datePublished: meta.createdAt }),
    ...(meta.author && {
      author: { "@type": "Person", name: meta.author },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex gap-12">
          <div className="flex-1 min-w-0">
            {get(meta, "coverImage.url") && (
              <figure className="mb-8">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                  <img
                    src={get(meta, "coverImage.url")}
                    alt={get(meta, "coverImage.alt", "Cover image")}
                    className="object-cover w-full h-full"
                  />
                </div>
                {get(meta, "coverImage.alt") && (
                  <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                    {get(meta, "coverImage.alt")}
                  </figcaption>
                )}
              </figure>
            )}
            <article>
              {meta.title && (
                <h1 className="text-4xl font-bold tracking-tight mb-2">{meta.title}</h1>
              )}
              {Array.isArray(meta.tags) && meta.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {meta.tags.map((tag: string) => (
                    <a key={tag} href={`/tags/${tag}/1`} className="select-none px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/70 transition-colors">
                      {tag}
                    </a>
                  ))}
                </div>
              )}
              {meta.excerpt && (
                <p className="text-muted-foreground text-lg mb-2">{meta.excerpt}</p>
              )}
              {meta.createdAt && (
                <p className="text-sm text-muted-foreground mb-8">
                  {dayjs(meta.createdAt).format("MMMM D, YYYY")}
                </p>
              )}
              <hr className="border-border mb-8" />
              <Content components={mdxComponents} />
            </article>
          </div>
          <aside className="w-56 shrink-0 hidden xl:block">
            <div className="sticky top-[calc(3.5rem+2rem)]">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
