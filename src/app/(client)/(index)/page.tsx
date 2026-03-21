import dayjs from "dayjs";
import { postLoader } from "@/server/post-loader";
import { HeroBlock } from "./_components/blocks/intro/hero-block";
import { PosterHeroBlock } from "./_components/blocks/intro/poster-hero-block";
import { SplitHeroBlock } from "./_components/blocks/intro/split-hero-block";
import { FullbleedHeroBlock } from "./_components/blocks/intro/fullbleed-hero-block";
import { ImageGridBlock } from "./_components/blocks/gallery/image-grid-block";
import { ImageReelBlock } from "./_components/blocks/gallery/image-reel-block";
import { MosaicGalleryBlock } from "./_components/blocks/gallery/mosaic-gallery-block";
import { BentoGalleryBlock } from "./_components/blocks/gallery/bento-gallery-block";
import { FocusGalleryBlock } from "./_components/blocks/gallery/focus-gallery-block";
import { PolaroidGalleryBlock } from "./_components/blocks/gallery/polaroid-gallery-block";
import { StatementBlock } from "./_components/blocks/editorial/statement-block";
import { PhilosophyBlock } from "./_components/blocks/editorial/philosophy-block";
import { SplitTextBlock } from "./_components/blocks/editorial/split-text-block";
import { PullQuoteBlock } from "./_components/blocks/editorial/pull-quote-block";
import { ManifestoBlock } from "./_components/blocks/editorial/manifesto-block";
import { VideoHeroBlock } from "./_components/blocks/theater/video-hero-block";
import { VideoSpotlightBlock } from "./_components/blocks/theater/video-spotlight-block";
import { VideoEditorialBlock } from "./_components/blocks/theater/video-editorial-block";
import { TimelineBlock } from "./_components/blocks/archive/timeline-block";
import { FeaturePostBlock } from "./_components/blocks/showcase/feature-post-block";
import { CardGridShowcaseBlock } from "./_components/blocks/showcase/card-grid-showcase-block";
import { MagazineShowcaseBlock } from "./_components/blocks/showcase/magazine-showcase-block";
import { MinimalListShowcaseBlock } from "./_components/blocks/showcase/minimal-list-showcase-block";
import { CtaBlock } from "./_components/blocks/cta/cta-block";
import { WaveformPlayerBlock } from "./_components/blocks/vinyl/waveform-player-block";
import { CoverPlayerBlock } from "./_components/blocks/vinyl/cover-player-block";
import { RipplePlayerBlock } from "./_components/blocks/vinyl/ripple-player-block";

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
  const showcaseItems = allPosts.slice(0, 6).map((p) => ({
    title: p.metadata.title ?? p.slug,
    excerpt: p.metadata.excerpt as string | undefined,
    date: p.metadata.createdAt
      ? dayjs(p.metadata.createdAt).format("MMM D, YYYY")
      : undefined,
    href: `/posts/${p.slug}`,
    image:
      (p.metadata.coverImage as { url?: string } | undefined)?.url ??
      "/posts/hello-world/images/image2.jpg",
    tags: Array.isArray(p.metadata.tags)
      ? (p.metadata.tags as string[]).slice(0, 2)
      : undefined,
  }));
  const timelineItems = allPosts.slice(0, 6).map((p) => ({
    date: dayjs(p.metadata.createdAt).format("MMM YYYY"),
    title: p.metadata.title ?? p.slug,
    href: `/posts/${p.slug}`,
    tag: Array.isArray(p.metadata.tags)
      ? (p.metadata.tags as string[])[0]
      : undefined,
  }));

  return (
    <div className="h-dvh overflow-hidden">
      <div className="h-full overflow-y-scroll snap-y snap-mandatory [&>section]:h-dvh">
        <HeroBlock
          id="hero"
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
          id="image-grid"
          images={[
            { src: "/images/home/image-1.jpg" },
            { src: "/images/home/image-2.jpg" },
            { src: "/images/home/image-3.jpg" },
          ]}
        />

        <MosaicGalleryBlock
          id="mosaic-gallery"
          images={[
            { src: "/images/home/image-1.jpg" },
            { src: "/posts/hello-world/cover.jpg" },
            { src: "/images/home/image-3.jpg" },
          ]}
          caption="Gallery"
        />

        <SplitHeroBlock
          id="split-hero"
          eyebrow="Handcraft Studio"
          title={"慢工，\n出細活。"}
          subtitle="不追流量，只追求值得反覆閱讀的文字。每一篇都花時間沉澱。"
          image="/images/home/image-2.jpg"
          ctaText="閱讀文章"
          ctaHref="/posts"
          secondaryCtaText="關於這裡"
          secondaryCtaHref="/about"
          tags={["文字", "創作", "生活", "思考"]}
          imageSide="right"
        />

        <BentoGalleryBlock
          id="bento-gallery"
          label="Collection"
          images={[
            { src: "/images/home/image-1.jpg" },
            { src: "/posts/hello-world/images/image1.jpg" },
            { src: "/images/home/image-2.jpg" },
            { src: "/posts/hello-world/cover.jpg" },
            { src: "/images/home/image-3.jpg" },
          ]}
        />

        <FullbleedHeroBlock
          id="fullbleed-hero"
          title={"用文字\n丈量生活。"}
          eyebrow="Handcraft"
          image="/images/home/image-3.jpg"
          overlayOpacity={55}
          metaValue="2024"
          metaLabel="創立至今"
          ctaText="開始探索"
          ctaHref="/posts"
          nav={{
            logo: "Handcraft",
            links: [
              { label: "文章", href: "/posts" },
              { label: "關於", href: "/about" },
            ],
          }}
        />

        <FocusGalleryBlock
          id="focus-gallery"
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
          id="polaroid-gallery"
          label="Memories"
          images={[
            { src: "/images/home/image-1.jpg", caption: "2024 春" },
            { src: "/posts/hello-world/cover.jpg", caption: "Hello World" },
            { src: "/images/home/image-2.jpg", caption: "日常" },
            { src: "/posts/hello-world/images/image1.jpg", caption: "光與影" },
            { src: "/images/home/image-3.jpg", caption: "靜物" },
          ]}
        />

        <VideoHeroBlock
          id="video-hero"
          src="/videos/demo.mp4"
          eyebrow="Handcraft"
          title={`文字，是最慢的\n藝術。`}
          subtitle="在這個快速消費的時代，我們選擇放慢腳步，用文字記錄真實的生活。"
          ctaText="開始閱讀"
          ctaHref="/posts"
          overlayOpacity={55}
        />

        <VideoEditorialBlock
          id="video-editorial"
          src="/videos/demo.mp4"
          eyebrow="Behind the Craft"
          title={"每一篇文字\n背後的故事"}
          body="寫作不只是輸出想法，更是一種與自己對話的過程。每一篇文章都需要時間沉澱，才能讓文字真正有重量。"
          footnote="Handcraft 相信慢即是快，深即是廣。"
          ctaText="了解更多"
          ctaHref="/about"
          videoSide="right"
        />

        <VideoSpotlightBlock
          id="video-spotlight"
          src="/videos/demo.mp4"
          backgroundImage="/images/home/image-1.jpg"
          label="Demo"
          caption="Handcraft — 手工文字的誕生"
          overlayOpacity={50}
        />

        <ImageReelBlock
          id="image-reel"
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

        <PullQuoteBlock
          id="pull-quote"
          quote="好的文字不需要大聲，它只需要真實。"
          author="Handcraft"
          role="創作理念"
          image="/images/home/image-3.jpg"
          overlay="dark"
          align="center"
        />

        <StatementBlock
          id="statement"
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

        <SplitTextBlock
          id="split-text"
          eyebrow="Craft"
          sectionNumber="02"
          title="慢下來，才能看見真正重要的事。"
          body="在資訊過載的時代，Handcraft 選擇放慢腳步。每一篇文章都經過反覆思考與打磨，不為點擊率，只為留下值得回讀的文字。"
          footnote="寫作是一種修煉，讀者是最好的見證者。"
          linkHref="/about"
          linkText="關於這裡"
        />

        <PhilosophyBlock
          id="philosophy"
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

        <ManifestoBlock
          id="manifesto"
          eyebrow="我們相信"
          lines={[
            { text: "手作是一種誠實。" },
            { text: "慢是一種立場，不是缺陷。", style: "italic", indent: true },
            { text: "文字值得被認真對待。" },
            { text: "讀者不是流量，是對話的對象。", indent: true },
            { text: "每一篇，都是一個承諾。", style: "italic" },
          ]}
          linkHref="/posts"
          linkText="開始閱讀"
          variant="dark"
        />

        <PosterHeroBlock
          id="poster-hero"
          title="Handcraft"
          eyebrow="文字是手工藝，每一篇都是用心雕琢的作品"
          image="/images/home/people.png"
          ctaText="開始閱讀"
          ctaHref="/posts"
          socialProof={{ count: `${allPosts.length}+`, text: "篇文章" }}
          tags={["手工", "文字", "創作", "生活", "思考"]}
          nav={{
            logo: "Handcraft",
            links: [
              { label: "文章", href: "/posts" },
              { label: "關於", href: "/about" },
            ],
          }}
        />

        {timelineItems.length > 0 && (
          <TimelineBlock
            id="timeline"
            label="Latest"
            title="最新文章"
            items={timelineItems}
            viewAllHref="/posts"
            viewAllText="查看全部"
          />
        )}

        {showcaseItems.length >= 3 && (
          <CardGridShowcaseBlock
            id="card-grid-showcase"
            eyebrow="近期文章"
            title="最新更新"
            items={showcaseItems.slice(0, 3)}
            viewAllHref="/posts"
            viewAllText="查看全部"
          />
        )}

        {showcaseItems.length >= 3 && (
          <MagazineShowcaseBlock
            id="magazine-showcase"
            eyebrow="精選"
            items={
              showcaseItems.slice(0, 3) as [
                (typeof showcaseItems)[0],
                (typeof showcaseItems)[0],
                (typeof showcaseItems)[0],
              ]
            }
          />
        )}

        {showcaseItems.length > 0 && (
          <MinimalListShowcaseBlock
            id="minimal-list-showcase"
            eyebrow="Archive"
            title="所有文章"
            items={showcaseItems}
            viewAllHref="/posts"
            viewAllText="查看全部"
            variant="dark"
          />
        )}

        {featuredPost && (
          <FeaturePostBlock
            id="feature-post"
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

        <WaveformPlayerBlock
          id="waveform-player"
          src="/audios/demo.mp3"
          title="Demo Track"
          artist="Handcraft"
        />

        <CoverPlayerBlock
          id="cover-player"
          src="/audios/demo.mp3"
          backgroundImage="/images/home/image-1.jpg"
          title="Demo Track"
          artist="Handcraft"
          label="Now Playing"
        />

        <RipplePlayerBlock
          id="ripple-player"
          src="/audios/demo.mp3"
          backgroundImage="/images/home/image-1.jpg"
          title="Demo Track"
          artist="Handcraft"
        />

        <CtaBlock
          id="cta"
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
