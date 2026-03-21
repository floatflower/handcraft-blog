import dayjs from "dayjs";
import { postLoader } from "@/server/post-loader";
import { HeroBlock } from "./_components/blocks/intro/hero-block";
import { ImageGridBlock } from "./_components/blocks/gallery/image-grid-block";
import { ImageReelBlock } from "./_components/blocks/gallery/image-reel-block";
import { MosaicGalleryBlock } from "./_components/blocks/gallery/mosaic-gallery-block";
import { BentoGalleryBlock } from "./_components/blocks/gallery/bento-gallery-block";
import { FocusGalleryBlock } from "./_components/blocks/gallery/focus-gallery-block";
import { PolaroidGalleryBlock } from "./_components/blocks/gallery/polaroid-gallery-block";
import { StatementBlock } from "./_components/blocks/editorial/statement-block";
import { PhilosophyBlock } from "./_components/blocks/editorial/philosophy-block";
import { TimelineBlock } from "./_components/blocks/archive/timeline-block";
import { FeaturePostBlock } from "./_components/blocks/showcase/feature-post-block";
import { CtaBlock } from "./_components/blocks/cta/cta-block";

const REEL_IMAGES = [
  "/images/home/image-1.jpg",
  "/posts/hello-world/images/image1.jpg",
  "/images/home/image-2.jpg",
  "/posts/hello-world/cover.jpg",
  "/images/home/image-3.jpg",
  "/posts/hello-world/images/image2.jpg",
];

export default async function Home() {
  const allPosts = postLoader().sort(
    (a, b) =>
      dayjs(b.metadata.createdAt).valueOf() -
      dayjs(a.metadata.createdAt).valueOf(),
  );

  const featuredPost = allPosts[0];
  const timelineItems = allPosts.slice(0, 6).map((p) => ({
    date: dayjs(p.metadata.createdAt).format("MMM YYYY"),
    title: p.metadata.title ?? p.slug,
    href: `/posts/${p.slug}`,
    tag: Array.isArray(p.metadata.tags)
      ? (p.metadata.tags as string[])[0]
      : undefined,
  }));

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full overflow-y-scroll snap-y snap-mandatory [&>section]:h-screen">
        <HeroBlock
          label="Welcome to"
          title="Handcraft"
          subtitle="文字是手工藝，每一篇都是用心雕琢的作品。"
          backgroundLetter="H"
          nav={{
            logo: "Handcraft",
            links: [
              { label: "文章", href: "/posts" },
              { label: "關於", href: "/about" },
            ],
          }}
        />

        <ImageGridBlock
          images={[
            { src: "/images/home/image-1.jpg" },
            { src: "/images/home/image-2.jpg" },
            { src: "/images/home/image-3.jpg" },
          ]}
        />

        <MosaicGalleryBlock
          images={[
            { src: "/images/home/image-1.jpg" },
            { src: "/posts/hello-world/cover.jpg" },
            { src: "/images/home/image-3.jpg" },
          ]}
          caption="Gallery"
        />

        <BentoGalleryBlock
          label="Collection"
          images={[
            { src: "/images/home/image-1.jpg" },
            { src: "/posts/hello-world/images/image1.jpg" },
            { src: "/images/home/image-2.jpg" },
            { src: "/posts/hello-world/cover.jpg" },
            { src: "/images/home/image-3.jpg" },
          ]}
        />

        <FocusGalleryBlock
          label="Moments"
          title="用鏡頭記錄生活"
          images={[
            { src: "/images/home/image-2.jpg" },
            { src: "/images/home/image-1.jpg" },
            { src: "/posts/hello-world/images/image1.jpg" },
            { src: "/posts/hello-world/images/image2.jpg" },
          ]}
        />

        <PolaroidGalleryBlock
          label="Memories"
          images={[
            { src: "/images/home/image-1.jpg", caption: "2024 春" },
            { src: "/posts/hello-world/cover.jpg", caption: "Hello World" },
            { src: "/images/home/image-2.jpg", caption: "日常" },
            { src: "/posts/hello-world/images/image1.jpg", caption: "光與影" },
            { src: "/images/home/image-3.jpg", caption: "靜物" },
          ]}
        />

        <ImageReelBlock
          images={REEL_IMAGES}
          label="Manifesto"
          title={"不批量生產，\n只手工雕琢。"}
          subtitle="每一篇文章都花時間沉澱，因為文字值得被認真對待。"
          tickerWordsTop={[
            "手工藝",
            "思考",
            "靈感",
            "創作",
            "生活",
            "記錄",
            "探索",
            "文字",
          ]}
          tickerWordsBottom={[
            "Writing",
            "Thinking",
            "Living",
            "Creating",
            "Exploring",
            "Crafting",
            "Sharing",
            "Reflecting",
          ]}
          reelDuration={48}
        />

        <StatementBlock
          variant="dark"
          label="About"
          statement={"文字不是\n快消品。"}
          footnote="在這裡，每一篇都值得花時間讀完。"
          nav={{
            logo: "Handcraft",
            links: [
              { label: "文章", href: "/posts" },
              { label: "關於", href: "/about" },
            ],
          }}
        />

        <PhilosophyBlock
          label="Philosophy"
          title="創作理念"
          image="/posts/hello-world/cover.jpg"
          imageLabel="Philosophy"
          items={[
            {
              num: "01",
              title: "手工",
              desc: "每一篇文章都是親手打造，不批量生產，不為流量服務。",
            },
            {
              num: "02",
              title: "真實",
              desc: "紀錄真實的思考與感受，不過度包裝，不迎合演算法。",
            },
            {
              num: "03",
              title: "沉澱",
              desc: "文字是思想的沉澱，寫作是與自己對話最誠實的方式。",
            },
          ]}
        />

        {timelineItems.length > 0 && (
          <TimelineBlock
            label="Latest"
            title="最新文章"
            items={timelineItems}
            viewAllHref="/posts"
            viewAllText="查看全部"
          />
        )}

        {featuredPost && (
          <FeaturePostBlock
            label="Featured"
            title={featuredPost.metadata.title ?? featuredPost.slug}
            excerpt={featuredPost.metadata.excerpt}
            date={
              featuredPost.metadata.createdAt
                ? dayjs(featuredPost.metadata.createdAt).format("MMM D, YYYY")
                : undefined
            }
            href={`/posts/${featuredPost.slug}`}
            backgroundImage={
              (featuredPost.metadata.coverImage as { url?: string } | undefined)
                ?.url ?? "/posts/hello-world/images/image2.jpg"
            }
            tags={
              Array.isArray(featuredPost.metadata.tags)
                ? (featuredPost.metadata.tags as string[]).slice(0, 3)
                : []
            }
            nav={{
              logo: "Handcraft",
              links: [
                { label: "文章", href: "/posts" },
                { label: "關於", href: "/about" },
              ],
            }}
          />
        )}

        <CtaBlock
          label="Start Reading"
          count={allPosts.length}
          countLabel="篇文章，等著你。"
          href="/posts"
          buttonText="開始閱讀"
          backgroundImage="/posts/hello-world/images/image1.jpg"
          nav={{
            logo: "Handcraft",
            links: [
              { label: "文章", href: "/posts" },
              { label: "關於", href: "/about" },
            ],
          }}
        />
      </div>
    </div>
  );
}
