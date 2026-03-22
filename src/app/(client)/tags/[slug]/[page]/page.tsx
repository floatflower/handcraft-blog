import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { postLoader } from "@/server/post-loader";
import dayjs from "dayjs";
import { TagPostsList } from "./_components/tag-posts-list";
import { PostListEditorial } from "./_components/post-list-editorial";
import { PostListRow } from "./_components/post-list-row";

const PAGE_SIZE = 12;

type Params = Promise<{ slug: string; page: string }>;

const getTemplate = (type: string) => {
  switch (type) {
    case "食譜":
      return PostListEditorial;
    case "炒飯":
      return PostListRow;
    default:
      return TagPostsList;
  }
};

export function generateStaticParams() {
  const posts = postLoader();

  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    if (!Array.isArray(post.metadata.tags)) continue;
    for (const tag of post.metadata.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const params: { slug: string; page: string }[] = [];
  for (const [slug, count] of tagCounts) {
    const totalPages = Math.ceil(count / PAGE_SIZE);
    for (let p = 1; p <= totalPages; p++) {
      params.push({ slug: encodeURIComponent(slug), page: String(p) });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug, page } = await params;
  return {
    title: `#${slug} · 第 ${page} 頁 — Handcraft`,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug: slugParam, page: pageParam } = await params;
  const slug = decodeURIComponent(slugParam);
  const currentPage = Math.max(1, parseInt(pageParam, 10) || 1);

  const allPosts = postLoader()
    .filter((p) => {
      return Array.isArray(p.metadata.tags) && p.metadata.tags.includes(slug);
    })
    .sort(
      (a, b) =>
        dayjs(b.metadata.createdAt).valueOf() -
        dayjs(a.metadata.createdAt).valueOf(),
    );

  if (allPosts.length === 0) notFound();

  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  if (currentPage > totalPages) notFound();

  const posts = allPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const Template = getTemplate(slug);

  return (
    <Template
      {...{
        tag: slug,
        posts,
        totalCount: allPosts.length,
        currentPage,
        totalPages,
      }}
    />
  );
}
