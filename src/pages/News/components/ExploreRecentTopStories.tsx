import { useEffect, useRef, useState } from "react";
import type { Blog } from '../../../api/hooks/blog/useBlogs';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router-dom";

interface ExploreRecentTopStoriesProps {
  blogs: Blog[];
}

const GLOW_COLORS = [
  "bg-[radial-gradient(circle_at_top_left,rgba(68,212,169,0.35),transparent_65%)]",
  "bg-[radial-gradient(circle_at_top_left,rgba(110,133,255,0.4),transparent_65%)]",
  "bg-[radial-gradient(circle_at_top_left,rgba(246,200,98,0.45),transparent_70%)]",
  "bg-[radial-gradient(circle_at_top_left,rgba(90,205,255,0.45),transparent_70%)]",
  "bg-[radial-gradient(circle_at_top_left,rgba(215,151,255,0.5),transparent_70%)]",
  "bg-[radial-gradient(circle_at_top_left,rgba(104,220,255,0.45),transparent_70%)]",
];

function TopStoryCard({ story, glowColor }: { story: Blog; glowColor: string }) {
  const navigate = useNavigate();
  const backgroundImage = story.assets?.[0]?.asset_url || '/api/placeholder/400/300';
  const primaryTicker = story.tickers?.[0] || 'BLOG';
  const handleClick = () => {
    navigate(`/blog/${story.id}`);
  };

  return (
    <article className="group relative flex h-full min-h-[300px] sm:min-h-[320px] !overflow-hidden rounded-xl shadow-[0_40px_120px_rgba(4,3,14,0.65)] transition-all duration-500 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_50px_140px_rgba(5,4,18,0.75)] cursor-pointer" onClick={handleClick}>
      <img
        src={backgroundImage}
        alt={story.assets?.[0]?.alt_text || story.title}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
      />

      {/* Readability overlays */}
      <div className={`pointer-events-none absolute inset-0 opacity-90 mix-blend-screen ${glowColor}`} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_58%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(182deg,rgba(6,5,15,0.25)_0%,rgba(6,5,15,0.6)_42%,rgba(6,5,16,0.94)_95%)] md:bg-[linear-gradient(182deg,rgba(6,5,15,0.15)_0%,rgba(6,5,15,0.55)_42%,rgba(6,5,16,0.92)_95%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-80" />

      <div className="relative z-10 flex h-full w-full flex-col justify-end gap-24 p-6 sm:p-8 rounded-4xl overflow-hidden">
        <span className="absolute top-4 left-4 inline-flex items-center justify-center gap-2 self-start rounded-full border border-black bg-black px-4 py-1.5 text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.55em] text-white shadow-[0_10px_40px_rgba(6,5,18,0.6)] backdrop-blur-[1.5px] transition-colors duration-300 group-hover:border-white group-hover:text-white">
          {primaryTicker}
        </span>

        <div className="flex flex-col gap-2 sm:gap-3">
          <h3 className="line-clamp-2 text-balance text-[1.1rem] sm:text-[1.25rem] leading-snug text-white transition-colors duration-300 group-hover:text-amber-50">
            {story.title}
          </h3>
          <span className="text-[0.85rem] sm:text-[0.9rem] font-medium text-white/65">
            {formatDistanceToNow(new Date(story.createdAt))} ago
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-6 sm:inset-x-8 bottom-0 h-28 rounded-full bg-[radial-gradient(circle_at_bottom,rgba(160,132,255,0.32),transparent_75%)] opacity-80 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 rounded-[28px] md:rounded-[36px]" />
    </article>
  );
}

function MobileStoriesCarousel({ stories }: { stories: Blog[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      setIndex(Math.round(el.scrollLeft / w));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="md:hidden">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        {stories.map((story, i) => (
          <div key={story.id} className="snap-center shrink-0 basis-[88%] sm:basis-[75%]">
            <TopStoryCard story={story} glowColor={GLOW_COLORS[i % GLOW_COLORS.length]} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-5 flex justify-center">
        <div className="rounded-full bg-black/70 px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {stories.map((_, i) => (
              <span
                key={i}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? "w-4 bg-white" : "w-2 bg-white/35"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExploreRecentTopStories({ blogs }: ExploreRecentTopStoriesProps) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-10 mb-40">
      <div className="pointer-events-none absolute inset-x-0 -top-60 -z-10 mx-auto h-[580px] sm:h-[520px] max-w-6xl rounded-full bg-[radial-gradient(circle_at_center,rgba(103,75,240,0.22),rgba(30,20,68,0.08)_55%,transparent_78%)] blur-[120px] sm:blur-[140px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 md:gap-12">
        <header className="flex flex-col items-center gap-3 text-center">
          <h2 className="mx-auto max-w-3xl text-center text-balance text-3xl sm:text-4xl md:text-6xl font-light">
            Explore recent top stories
          </h2>
        </header>

        {/* Mobile slider */}
        <MobileStoriesCarousel stories={blogs} />

        {/* Desktop grid */}
        <div className="hidden md:grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((story, index) => (
            <TopStoryCard
              key={story.id}
              story={story}
              glowColor={GLOW_COLORS[index % GLOW_COLORS.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}