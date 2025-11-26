import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import singleBox from '../../../assets/Home/singlebox.png';
import type { Blog } from '../../../api/hooks/blog/useBlogs';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { FALLBACK_IMAGES } from "@/types/blog";

interface TrendingMarketNewsSectionProps {
  blogs: Blog[];
  isLoading: boolean;
  sortBy: 'latest' | 'hot';
  onSortChange: (sort: 'latest' | 'hot') => void;
}



export default function TrendingMarketNewsSection({
  blogs,
  isLoading,
  sortBy,
  onSortChange
}: TrendingMarketNewsSectionProps) {
  const navigate = useNavigate();
  const featuredBlog = blogs[0];
  const handleFeaturedClick = () => {
    if (featuredBlog) {
      navigate(`/blog/${featuredBlog.id}`);
    }
  };

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-10 mb-6">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 md:gap-12">
        <div className="flex flex-col items-center gap-6">
          <h1 className="mx-auto max-w-3xl text-center text-balance text-3xl sm:text-4xl md:text-6xl font-light mt-10">
            Blogs
          </h1>

          {/* Sort Controls */}
          <div className="flex gap-2 p-1 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Button
              variant={sortBy === 'latest' ? "default" : "ghost"}
              size="sm"
              onClick={() => onSortChange('latest')}
              className={`rounded-xl transition-all ${sortBy === 'latest'
                ? 'bg-white text-black shadow-lg'
                : 'text-white/70 hover:text-white'
                }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Latest
            </Button>
            <Button
              variant={sortBy === 'hot' ? "default" : "ghost"}
              size="sm"
              onClick={() => onSortChange('hot')}
              className={`rounded-xl transition-all ${sortBy === 'hot'
                ? 'bg-white text-black shadow-lg'
                : 'text-white/70 hover:text-white'
                }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Card className="relative isolate overflow-hidden h-[500px] rounded-[40px] border border-white/10 bg-gradient-to-br from-purple-900/20 to-blue-900/20 animate-pulse" onClick={handleFeaturedClick}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
            <CardContent className="absolute bottom-0 z-10 w-full p-8">
              <div className="h-6 bg-white/20 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ) : featuredBlog ? (
          <Card className="relative isolate overflow-hidden h-[500px] rounded-[40px] shadow-[0_60px_120px_rgba(3,3,16,0.65)] cursor-pointer group hover:shadow-[0_80px_160px_rgba(3,3,16,0.8)] transition-all duration-500">
            {featuredBlog.assets?.[0]?.asset_url ? (
              <img
                src={featuredBlog.assets[0].asset_url}
                alt={featuredBlog.assets[0].alt_text}
                className="absolute inset-0 w-full h-full object-cover top-0 lg:h-[580px] lg:-top-[80px] transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = FALLBACK_IMAGES.BLOG_HERO;
                }}
              />
            ) : (
              <img
                src={FALLBACK_IMAGES.BLOG_HERO}
                alt="Default blog background"
                className="absolute inset-0 w-full h-full object-cover top-0 lg:h-[580px] lg:-top-[80px] transition-transform duration-700 group-hover:scale-105"
              />
            )}

            {/* Overlays */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,4,12,0.1)_0%,rgba(7,6,15,0.55)_45%,rgba(7,6,15,0.85)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(132,89,255,0.25),transparent_60%)] mix-blend-screen" />

            {/* Content */}
            <CardContent className="absolute bottom-0 z-10 flex w-full flex-col gap-5 sm:gap-6 px-5 sm:px-6 lg:px-8 pt-20 pb-5 lg:pt-24 lg:pb-6 lg:flex-row lg:items-center">
              <article className="flex flex-1 flex-col gap-2 text-left">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                  <span className="flex items-center justify-center text-amber-300">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {featuredBlog.tickers?.join(', ')} • {formatDistanceToNow(new Date(featuredBlog.createdAt))} ago
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="text-balance text-2xl sm:text-3xl leading-tight text-white group-hover:text-amber-50 transition-colors">
                    {featuredBlog.title}
                  </h2>
                  {featuredBlog.subtitle && (
                    <p className="text-sm sm:text-base leading-relaxed text-white/80 w-full sm:w-11/12 lg:w-3/4 line-clamp-2">
                      {featuredBlog.subtitle}
                    </p>
                  )}
                </div>
              </article>

              {/* Metrics */}
              <div className="flex items-center gap-4 text-white/60">
                {featuredBlog.votes && featuredBlog.votes.length > 0 && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">{featuredBlog.votes.length}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="relative isolate overflow-hidden h-[500px] rounded-[40px] border border-white/10 bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
            <div className="text-center text-white/60">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No blogs available</p>
              <p className="text-sm mt-2">Check back later for new content</p>
            </div>
          </Card>
        )}
      </div>

      {/* Background Elements */}
      <div className="!overflow-hidden myBullBg">
        <img src={singleBox} alt="box" className="absolute -left-[450px] -top-10 object-contain w-1/2 sm:block hidden !-z-90" />
        <div className="green-shadow -top-10 -left-[450px] sm:block hidden !-z-90"></div>
      </div>

      <div className="">
        <img src={singleBox} alt="box" className="absolute -right-[380px] top-44 object-contain w-1/2 -z-90 sm:block hidden" />
        <div className="purple-shadow sm:w-[600px] sm:-right-96 sm:h-[450px] sm:top-20 w-1/2 h-1/4 bottom-24 right-20 -z-50"></div>
      </div>
    </section>
  );
}