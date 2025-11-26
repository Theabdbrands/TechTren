import { X } from "lucide-react";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { newsData } from "@/Content/singlenewsdata";

export default function SingleNewsDetail() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [api]);

  const getDotStyle = (index: number) => {
    const distanceFromActive = Math.abs(index - current);

    // Active dot
    if (distanceFromActive === 0) {
      return {
        width: "1rem",
        height: "0.5rem",
        opacity: 1
      };
    }
    // Immediate neighbors (1 away)
    if (distanceFromActive === 1 || distanceFromActive === (count - 1)) {
      return {
        width: "0.6rem",
        height: "0.6rem",
        opacity: 0.8
      };
    }
    // Next neighbors (2 away)
    if (distanceFromActive === 2 || distanceFromActive === (count - 2)) {
      return {
        width: "0.4rem",
        height: "0.4rem",
        opacity: 0.5
      };
    }
    // Farthest dots
    return {
      width: "0.4rem",
      height: "0.4rem",
      opacity: 0.3
    };
  };

  return (
    <div className="relative max-w-7xl mx-auto px-10 mb-10">
      {/* Article Content */}
      <div className="px-10 pt-36 relative">
        <h3 className="text-[52px] font-normal leading-tight mb-4 sm:mb-6">
          {newsData.title}
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-6 sm:mb-10">
          by <span className="text-white font-medium underline hover:no-underline cursor-pointer">{newsData.author}</span> {newsData.authorRole}
        </p>

        {/* Carousel */}
        <div className="relative mt-4">
          <Carousel setApi={setApi} className="w-full overflow-hidden rounded-xl sm:rounded-2xl" opts={{ loop: true }}>
            <CarouselContent>
              {newsData.carouselImages.map((src, i) => (
                <CarouselItem key={i}>
                  <img
                    src={src}
                    alt={`Slide ${i + 1}`}
                    className="w-full h-64 sm:h-96 lg:h-[550px] object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <button
            className="absolute top-3 right-4 rounded-full glass !px-6 !py-2 flex items-center hover:!bg-white/20 transition-all duration-300 gap-2"
            style={{
              background: 'rgba(20, 20, 20, 0.30)',
            }}>
            Follow on <X size={16} />
          </button>

          {/* Enhanced Pagination Dots - Same as RevolutionSlider */}
          <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-6 flex justify-center z-10">
            <div className="flex items-center gap-3 px-6 py-3 bg-black/80 border border-gray-700/40 rounded-full">
              {Array.from({ length: count }).map((_, i) => {
                const dotStyle = getDotStyle(i);
                return (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={cn(
                      "transition-all duration-300 rounded-full hover:bg-gray-400",
                      current === i ? "bg-white" : "bg-gray-600"
                    )}
                    style={{
                      width: dotStyle.width,
                      height: dotStyle.height,
                      opacity: dotStyle.opacity
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="mt-8 sm:mt-12 text-base sm:text-lg lg:text-[22px] font-[300] text-gray-300 space-y-4 sm:space-y-6">
          {newsData.intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Dynamic Sections */}
        {newsData.sections.map((section, i) => (
          <div key={i} className={cn("mt-16", section.image ? "grid md:grid-cols-2 gap-6 sm:gap-10 items-center" : "space-y-4 sm:space-y-6")}>
            {section.image ? (
              <>
                <div className="rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-[400px] order-2 md:order-1">
                  <img src={section.image} alt={section.heading} className="w-full h-full object-cover" />
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-[500] mb-3 sm:mb-4">{section.heading}</h2>
                  <p className="text-base sm:text-lg lg:text-[22px] font-[300] text-gray-300 whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-[500]">{section.heading}</h2>
                <p className="text-base sm:text-lg lg:text-[22px] font-[300] text-gray-300 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Related Articles */}
      <div className="px-8 py-16 relative">
        <h2 className="text-center mb-10 text-6xl">
          You may also like to read
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {newsData.related.map((item, i) => (
            <div
              key={i}
              className="transition-all duration-300 cursor-pointer group border rounded-xl overflow-hidden"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="px-4 py-4 pb-6">
                {/* <span className="text-xs uppercase text-gray-400 tracking-wider">{item.tag}</span> */}
                <p className="text-xl mb-2">
                  {item.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}