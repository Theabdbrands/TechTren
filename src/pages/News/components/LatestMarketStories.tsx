import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Clock } from "lucide-react";
import type { Blog } from '../../../api/hooks/blog/useBlogs';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { FALLBACK_IMAGES } from "@/types/blog";

interface LatestMarketStoriesProps {
  blogs: Blog[];
}

function MetricsRow({ blog }: { blog: Blog }) {
  return (
    <div className="flex items-center gap-4 sm:gap-5 text-xs sm:text-sm text-white/70">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
        <span className="font-semibold text-white text-xs sm:text-sm">
          {formatDistanceToNow(new Date(blog.createdAt))}
        </span>
      </div>

      {blog.votes && blog.votes.length > 0 && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FF6B9A]" />
          <span className="font-semibold text-white text-xs sm:text-sm">
            {blog.votes.length}
          </span>
        </div>
      )}

      {blog.tickers && blog.tickers.length > 0 && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-semibold text-white text-xs sm:text-sm">
            {blog.tickers[0]}
          </span>
        </div>
      )}
    </div>
  );
}

function MarketStoryCard({ blog }: { blog: Blog }) {
  const navigate = useNavigate();
  const backgroundImage = blog.assets?.[0]?.asset_url || FALLBACK_IMAGES.BLOG_CARD;

  const handleClick = () => {
    navigate(`/blog/${blog.id}`);
  };

  return (
    <Card className="group relative flex min-h-[400px] sm:min-h-[400px] lg:min-h-[525px] overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/5 bg-[#0b0715] text-white shadow-[0_40px_120px_rgba(5,4,15,0.6)] transition-transform duration-500 hover:-translate-y-1 hover:border-white/10 cursor-pointer" onClick={handleClick}>
      {/* Background Image */}
      <img
        src={backgroundImage}
        alt={blog.assets?.[0]?.alt_text || blog.title}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = FALLBACK_IMAGES.BLOG_CARD;
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 lg:hidden bg-[linear-gradient(200deg,rgba(11,8,26,0.05)_0%,rgba(6,5,16,0.6)_55%,rgba(6,4,12,0.9)_100%)]" />
      <div className="absolute inset-0 lg:hidden bg-[radial-gradient(circle_at_bottom,rgba(119,97,255,0.22),transparent_60%)] mix-blend-screen" />
      <div className="absolute inset-0 hidden lg:block bg-[radial-gradient(circle_at_top_right,rgba(119,97,255,0.45),transparent_55%)] opacity-60 mix-blend-screen" />
      <div className="absolute inset-0 hidden lg:block bg-[linear-gradient(200deg,rgba(11,8,26,0.25)_0%,rgba(6,5,16,0.85)_65%,rgba(6,4,12,0.92)_100%)]" />

      <CardContent className="relative z-10 mt-auto flex flex-col gap-4 sm:gap-6 p-5 sm:p-6 lg:p-8">
        <header className="flex items-center gap-2 text-[0.7rem] sm:text-xs uppercase tracking-[0.35em] text-white/70">
          <span className="text-amber-300">
            <Sparkles className="h-4 w-4" />
          </span>
          {blog.communityId || 'TechTren'}
        </header>

        <h3 className="text-balance text-xl sm:text-[1.25rem] md:text-[1.35rem] lg:text-[1.45rem] font-semibold leading-snug text-white group-hover:text-amber-50 transition-colors">
          {blog.title}
        </h3>

        {blog.subtitle && (
          <p className="text-sm text-white/70 line-clamp-2">
            {blog.subtitle}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 text-[0.7rem] sm:text-xs uppercase tracking-[0.35em] text-white/60">
          <span>{formatDistanceToNow(new Date(blog.createdAt))} ago</span>
          <MetricsRow blog={blog} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function LatestMarketStories({ blogs }: LatestMarketStoriesProps) {
  if (!blogs || blogs.length === 0) {
    return (
      <section className="relative w-full px-4 sm:px-6 lg:px-10 mb-24">
        <div className="mx-auto w-full max-w-6xl text-center py-12">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-white/40" />
          <h3 className="text-xl text-white/60">No stories available</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-10 mb-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[420px] sm:h-[560px] lg:h-[620px] max-w-5xl -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(118,90,255,0.18),rgba(36,24,72,0.1)_55%,transparent_75%)] blur-3xl" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {blogs.map((blog) => (
            <MarketStoryCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}