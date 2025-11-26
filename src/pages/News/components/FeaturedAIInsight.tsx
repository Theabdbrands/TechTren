import { Card } from "@/components/ui/card";
import TECH_VIDEO from "../../../assets/News/tech.mp4";
import X from "../../../assets/Home/x.svg";
import singleBox from "../../../assets/Home/singlebox.png";
import type { Blog } from '../../../api/hooks/blog/useBlogs';
import { formatDistanceToNow } from 'date-fns';

interface FeaturedAIInsightProps {
  blogs: Blog[];
}

export default function FeaturedAIInsight({ blogs }: FeaturedAIInsightProps) {
  const aiBlog = blogs.find(blog =>
    blog.title.toLowerCase().includes('ai') ||
    blog.body.toLowerCase().includes('ai') ||
    blog.tickers?.some(ticker => ['NVDA', 'MSFT', 'GOOGL'].includes(ticker))
  ) || blogs[0];

  if (!aiBlog) {
    return null; // Don't render if no blogs
  }


  return (
    <section className="relative w-full pb-20 pt-10">
      <div className="relative mx-auto w-full max-w-[90%] overflow-hidden rounded-[24px] border border-white/10 shadow-[0_60px_140px_rgba(5,3,17,0.75)] z-10 cursor-pointer group hover:shadow-[0_80px_160px_rgba(5,3,17,0.9)] transition-all duration-500">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[70vh] sm:h-[600px] lg:h-[700px] object-cover"
        >
          <source src={TECH_VIDEO} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black/60 sm:bg-black/50 lg:bg-black/40" />

        {/* Mobile top-right info */}
        <div className="absolute right-3 top-3 z-20 flex items-center gap-2 rounded-[12px] border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm md:hidden">
          <span>{aiBlog.tickers?.join(', ')}</span>
          <span className="inline-flex items-center justify-center rounded-[10px] border border-white/30 p-1.5">
            <img src={X} alt="X" className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* Content */}
        <Card className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 z-10 w-[92%] sm:w-[90%] border-none bg-transparent -translate-x-1/2 transform">
          <div className="flex flex-col gap-3 sm:gap-5 md:flex-row md:items-end md:justify-between">
            <div className="mx-auto max-w-3xl text-center md:mx-0 md:text-left space-y-3 sm:space-y-4">
              <h2 className="text-[1.125rem] sm:text-[1.6rem] lg:text-[2.4rem] font-light leading-tight line-clamp-3 md:line-clamp-none group-hover:text-amber-50 transition-colors">
                {aiBlog.title}
                {aiBlog.subtitle && (
                  <span className="text-white/80 block text-sm sm:text-base mt-2">
                    {aiBlog.subtitle}
                  </span>
                )}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-white/70">
                Published <span className="font-semibold text-white">
                  {formatDistanceToNow(new Date(aiBlog.createdAt))} ago
                </span>
                {aiBlog.tickers && aiBlog.tickers.length > 0 && (
                  <> · <span className="font-semibold text-white">{aiBlog.tickers.join(', ')}</span></>
                )}
              </p>
            </div>

            {/* Desktop/Tablet follow button */}
            <button className="group hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-white/50 hover:bg-white/10 rounded-lg border border-white/20">
              Follow on
              <span className="border border-gray-600 p-2 rounded-[12px] cursor-pointer hover:bg-white transition-colors">
                <img
                  src={X}
                  alt="X"
                  className="h-4 w-4 transition-colors duration-200 group-hover:brightness-0"
                />
              </span>
            </button>
          </div>
        </Card>

        {/* Subtle inner border */}
        <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-white/10" />
      </div>

      {/* Decorative elements */}
      <div className="">
        <img src={singleBox} alt="box" className="absolute -left-[200px] -top-20 object-contain w-[60%] sm:block hidden" />
        <div className="ai-strategy-shade-purple -top-40 -left-[300px] sm:block hidden"></div>
      </div>

      <div className="">
        <img src={singleBox} alt="box" className="absolute -right-[200px] top-40 object-contain w-[60%] sm:block hidden" />
        <div className="ai-strategy-shade-green top-68 -right-[400px] sm:block hidden"></div>
      </div>
    </section>
  );
}