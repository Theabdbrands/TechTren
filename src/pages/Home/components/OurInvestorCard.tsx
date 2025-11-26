import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Stars from "../../../assets/Home/stars.png";
import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
} from "@/components/ui/shadcn-io/marquee";

// Partner logos
import logo11 from "../../../assets/Home/logo11.png";
import logo12 from "../../../assets/Home/logo12.png";
import logo13 from "../../../assets/Home/logo13.png";
import logo14 from "../../../assets/Home/logo14.png";
import logo15 from "../../../assets/Home/logo15.png";
import logo16 from "../../../assets/Home/logo16.png";

const originalTestimonials = [
  {
    id: 1,
    rating: 5.0,
    text: "It was good and smooth and I will always recommend Funded next to other and will recommend to myself as well.",
    name: "James Lippens",
    time: "2 hrs ago",
  },
  {
    id: 2,
    rating: 4.8,
    text: "Exceptional service! The process was seamless and the team was incredibly supportive throughout.",
    name: "Sarah Johnson",
    time: "1 hr ago",
  },
  {
    id: 3,
    rating: 4.9,
    text: "I'm impressed by the transparency and efficiency of the entire experience. Highly recommend.",
    name: "Michael Chen",
    time: "30 mins ago",
  },
  {
    id: 4,
    rating: 5.0,
    text: "The app is user-friendly and the customer support was top-notch. Will definitely use again.",
    name: "Emily Wang",
    time: "15 mins ago",
  },
  {
    id: 5,
    rating: 4.8,
    text: "Exceptional service! The process was seamless and the team was incredibly supportive throughout.",
    name: "Nick Greyman",
    time: "1 hr ago",
  },
  {
    id: 6,
    rating: 4.9,
    text: "I'm impressed by the transparency and efficiency of the entire experience. Highly recommend.",
    name: "John El",
    time: "30 mins ago",
  },
  {
    id: 7,
    rating: 5.0,
    text: "The app is user-friendly and the customer support was top-notch. Will definitely use again.",
    name: "Anwar Clar",
    time: "15 mins ago",
  },
];

// Duplicate for seamless loop
const testimonials = [...originalTestimonials, ...originalTestimonials];

const partnerLogos = [logo11, logo12, logo13, logo14, logo15, logo16];

const LogoMarquee = () => {
  return (
    <div className="relative w-full sm:mt-12 mt-8 max-w-4xl mx-auto">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[rgba(6,4,12,0.9)] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute rounded-lg right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[rgba(6,4,12,0.9)] to-transparent z-10 pointer-events-none"></div>

      <Marquee>
        <MarqueeContent pauseOnHover>
          {partnerLogos.map((logo, i) => (
            <MarqueeItem key={i} className="sm:mx-8 mx-4 flex-shrink-0">
              <div className="h-14 w-32 flex items-center justify-center">
                <img
                  src={logo}
                  alt={`Partner Logo ${i + 1}`}
                  className="h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105"
                />
              </div>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  );
};

export default function OurInvestorCard() {
  const [desktopApi, setDesktopApi] = React.useState<CarouselApi>();
  const [mobileApi, setMobileApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, _] = React.useState(originalTestimonials.length);

  // Desktop carousel autoplay and tracking
  React.useEffect(() => {
    if (!desktopApi) return;

    const update = () => {
      const selected = desktopApi.selectedScrollSnap() % originalTestimonials.length;
      setCurrent(selected);
    };

    update();
    desktopApi.on("select", update);

    const autoplay = setInterval(() => {
      desktopApi.scrollNext();
    }, 4000);

    return () => clearInterval(autoplay);
  }, [desktopApi]);

  // Mobile carousel autoplay
  React.useEffect(() => {
    if (!mobileApi) return;

    const autoplay = setInterval(() => {
      mobileApi.scrollNext();
    }, 4000);

    return () => clearInterval(autoplay);
  }, [mobileApi]);

  const getDotStyle = (index: number) => {
    const distanceFromActive = Math.abs(index - current);

    if (distanceFromActive === 0) {
      return { width: "1rem", height: "0.5rem", opacity: 1 };
    }
    if (distanceFromActive === 1 || distanceFromActive === 6) {
      return { width: "0.6rem", height: "0.6rem", opacity: 0.8 };
    }
    if (distanceFromActive === 2 || distanceFromActive === 5) {
      return { width: "0.4rem", height: "0.4rem", opacity: 0.5 };
    }
    return { width: "0.4rem", height: "0.4rem", opacity: 0.3 };
  };

  return (
    <section className="relative py-20 rounded-tl-3xl rounded-tr-3xl max-w-6xl mx-auto overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[450px] bg-[linear-gradient(180deg,rgba(20,232,147,0.1)_0%,rgba(6,4,12,0.1)_100%)] pointer-events-none -z-[1]"></div>

      <div className="relative max-w-7xl mx-auto sm:px-6 px-0">
        <div className="text-center mb-14 sm:px-0 px-4">
          <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-wide text-gray-400 mb-3">
            <Star className="w-3 h-3" />
            Social proof & Credibility
          </p>

          <h2 className="text-4xl sm:text-5xl font-medium mb-4 leading-tight">
            What our investors say about us
          </h2>

          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed mb-6">
            Tech Tren shines with investors like you! See what real investors
            have to say about our best-in-class prop AI based investment firm.
          </p>

          <div className="flex items-center justify-center gap-3 mt-5 text-base relative">
            <span className="font-medium">Excellent</span>
            <img src={Stars} alt="5 star rating" className="h-5 w-auto" />
            <span className="text-sm">5.0 rating from 1,650 reviews</span>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="relative mb-16">
          {/* Desktop Carousel */}
          <div className="hidden sm:block">
            <Carousel
              setApi={setDesktopApi}
              className="w-full"
              opts={{ align: "start", loop: true }}
            >
              <CarouselContent className="-ml-3 md:-ml-4 px-2">
                {testimonials.map((t, i) => (
                  <CarouselItem
                    key={`${t.id}-${i}`}
                    className="pl-3 md:pl-4 basis-1/2 lg:basis-1/4"
                  >
                    <Card className="border rounded-2xl h-full hover:border-gray-500 bg-transparent transition cursor-default">
                      <CardContent className="px-6 py-2 h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                          <img src={Stars} alt="Stars" className="h-4 w-auto" />
                          <span className="text-lg font-bold">{t.rating}</span>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed flex-grow mt-2 mb-5">
                          "{t.text}"
                        </p>

                        <div className="mt-auto">
                          <p className="text-base font-medium">{t.name}</p>
                          <p className="text-xs mt-1 text-gray-400">{t.time}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Mobile Carousel */}
          <div className="block sm:hidden overflow-visible">
            <Carousel
              setApi={setMobileApi}
              className="w-full"
              opts={{ align: "center", loop: true }}
            >
              <CarouselContent className="ml-1 mr-0">
                {testimonials.map((t, i) => (
                  <CarouselItem
                    key={`${t.id}-${i}`}
                    className="pl-2 pr-2 basis-3/4"
                  >
                    <div
                      className={cn(
                        "transition-all duration-300 transform",
                        current === (i % originalTestimonials.length)
                          ? "scale-100 opacity-100"
                          : "scale-90 opacity-70"
                      )}
                    >
                      <Card className="border rounded-2xl h-full hover:border-gray-500 bg-transparent transition cursor-default">
                        <CardContent className="px-6 py-2 h-full flex flex-col">
                          <div className="flex items-center gap-4 mb-4">
                            <img src={Stars} alt="Stars" className="h-4 w-auto" />
                            <span className="text-lg font-bold">{t.rating}</span>
                          </div>

                          <p className="text-gray-400 text-sm leading-relaxed flex-grow mt-2 mb-5">
                            "{t.text}"
                          </p>

                          <div className="mt-auto">
                            <p className="text-base font-medium">{t.name}</p>
                            <p className="text-xs mt-1 text-gray-400">{t.time}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Pagination Dots */}
          <div className="mt-10 flex justify-center">
            <div className="flex items-center gap-3 px-6 py-3 bg-black/80 border border-gray-700/40 h-9 rounded-full">
              {Array.from({ length: count }).map((_, i) => {
                const dotStyle = getDotStyle(i);
                return (
                  <button
                    key={i}
                    onClick={() => desktopApi?.scrollTo(i)}
                    className={cn(
                      "transition-all duration-300 rounded-full bg-gray-600 hover:bg-gray-400",
                      current === i && "bg-white"
                    )}
                    style={{
                      width: dotStyle.width,
                      height: dotStyle.height,
                      opacity: dotStyle.opacity,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer CTA + Marquee */}
        <div className="text-center sm:mt-20">
          <p className="sm:text-3xl sm:mb-8 font-semibold text-2xl mb-0">
            Join the 10,000+ investment firms network sharing insights
          </p>
          <LogoMarquee />
        </div>
      </div>
    </section>
  );
}
