import { useState, useEffect } from "react";
import { termsSections } from "../../../src/Content/termsdata";
import EllipseMobile from "../../assets/Home/EllipseMobile.svg";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showEllipse, setShowEllipse] = useState(true);

  useEffect(() => {
    const observers = termsSections.map((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(section.id);
              }
            });
          },
          {
            rootMargin: "-50% 0px -50% 0px",
            threshold: 0,
          }
        );
        observer.observe(element);
        return observer;
      }
      return null;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const endPosition = 4300;
      if (scrollY > endPosition) {
        setShowEllipse(false);
      } else {
        setShowEllipse(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let colorGreen = "#14E893";

  return (
    <>
      <div className="pt-36 relative mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-10">
            <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-normal text-white mb-2 leading-tight">
              TechTren terms of service
            </h1>
            <p className="text-[13px] sm:text-[14px] lg:text-sm text-gray-400">
              Effective Date: When you access or use Tech Tren, you agree to
              these Terms of Service.
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <aside
              className="w-[400px] h-fit sticky top-28 glass py-8"
              style={{
                background: "rgba(20, 20, 20, 0.30)",
              }}
            >
              <h3 className="font-light mb-5 text-2xl px-5">
                Table of content
              </h3>
              <nav>
                {termsSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className={`px-2 sm:px-8 py-3 gap-2 transition-all duration-200 flex items-start hover:text-white hover:bg-white/5 ${activeSection === section.id
                        ? `bg-[#14E893]/10 text-white border-r-4 border-[${colorGreen}] pr-2`
                        : "text-gray-400"
                      }`}
                  >
                    <span className="text-[11px] sm:text-xs text-white flex-shrink-0 mt-0.5">
                      {section.number}.
                    </span>
                    <span className="flex-1 break-words">{section.title}</span>
                  </a>
                ))}
              </nav>
            </aside>

            <main className="flex-1 pb-16 sm:pb-20 space-y-10 sm:space-y-12">
              {termsSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-[200px]"
                >
                  <h2 className="text-4xl font-normal mb-3 lg:mb-4 leading-tight">
                    {section.heading}
                  </h2>
                  <p className="text-base text-gray-400 leading-relaxed">
                    {section.content}
                  </p>
                </section>
              ))}
            </main>
          </div>
        </div>

        {showEllipse && (
          <span className="fixed -top-[500px] left-[15%] -z-10 transition-opacity duration-500">
            <img src={EllipseMobile} alt="glob" className="-z-10 scale-x-125" />
          </span>
        )}
      </div>
    </>
  );
}
