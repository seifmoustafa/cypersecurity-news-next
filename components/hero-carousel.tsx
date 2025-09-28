"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export default function HeroCarousel() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isRtl = language === "ar";

  const carouselItems = [
    {
      id: "comprehensive-platform",
      title: t("carousel.item1.title"),
      description: t("carousel.item1.description"),
      image: "/api/images/beginners/Gemini_Generated_Image_c7ds1sc7ds1sc7ds.png",
      primaryButton: t("carousel.item1.primaryButton"),
      secondaryButton: t("carousel.item1.secondaryButton"),
      primaryAction: () => router.push("/advanced"),
      secondaryAction: () => router.push("/simple"),
    },
    {
      id: "security-awareness",
      title: t("carousel.item2.title"),
      description: t("carousel.item2.description"),
      image: "/api/images/beginners/Gemini_Generated_Image_dudzufdudzufdudz.png",
      primaryButton: t("carousel.item2.primaryButton"),
      secondaryButton: t("carousel.item2.secondaryButton"),
      primaryAction: () => router.push("/advanced"),
      secondaryAction: () => router.push("/simple"),
    },
    {
      id: "personal-protection",
      title: t("carousel.item3.title"),
      description: t("carousel.item3.description"),
      image: "/api/images/beginners/Gemini_Generated_Image_ry6ctary6ctary6c.png",
      primaryButton: t("carousel.item3.primaryButton"),
      secondaryButton: t("carousel.item3.secondaryButton"),
      primaryAction: () => router.push("/advanced"),
      secondaryAction: () => router.push("/simple"),
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselItems.length, isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow and shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-1/3 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-3xl"></div>
        <div className="absolute top-1/3 right-10 h-32 w-32 rotate-45 rounded-xl bg-blue-500/20"></div>
        <div className="absolute bottom-1/4 left-10 h-24 w-24 -rotate-12 rounded-xl bg-violet-500/20"></div>
      </div>

      {/* Carousel container */}
      <div className="relative h-full">
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            <div className="grid h-full grid-cols-1 md:grid-cols-2 items-center md:gap-6 px-6 md:px-10 lg:px-16">
              {/* Content Section */}
              <div className={`flex flex-col justify-center ${isRtl ? "md:order-2" : "md:order-1"}`}>
                <div className="max-w-3xl backdrop-blur-sm/0">
                  {/* Title with gradient colors */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-6 tracking-tight">
                    <span className="text-orange-500">
                      {item.title.split(" ")[0]}
                    </span>
                    <span className="text-pink-500 ml-2">
                      {item.title.split(" ").slice(1, -2).join(" ")}
                    </span>
                    <span className="text-white ml-2">
                      {item.title.split(" ").slice(-2).join(" ")}
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl">
                    {item.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      onClick={item.primaryAction}
                      className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30"
                    >
                      {item.primaryButton}
                    </Button>
                    <Button
                      onClick={item.secondaryAction}
                      variant="ghost"
                      className="text-white hover:text-pink-400 px-8 py-4 text-base sm:text-lg font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                      {item.secondaryButton}
                      {isRtl ? (
                        <ChevronLeft className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className={`flex items-center justify-center ${isRtl ? "md:order-1" : "md:order-2"}`}>
                <div className="relative group">
                  {/* Enlarged Laptop mockup */}
                  <div className="relative w-[22rem] h-[14rem] sm:w-[28rem] sm:h-[18rem] lg:w-[36rem] lg:h-[22rem] bg-gray-800/60 rounded-2xl shadow-2xl ring-1 ring-white/10 transform rotate-[-8deg] group-hover:rotate-[-4deg] transition-transform duration-500 ease-out">
                    {/* Screen */}
                    <div className="absolute inset-3 sm:inset-4 bg-white rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Screen overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>

                    {/* Laptop base */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-gray-700/70 rounded-full"></div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-6 -right-6 h-8 w-8 rounded-full bg-pink-500/80 blur-[1px] animate-pulse"></div>
                  <div className="absolute -bottom-6 -left-6 h-6 w-6 rounded-full bg-orange-500/80 blur-[1px] animate-pulse" style={{ animationDelay: "1s" }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label={isRtl ? t("common.next") : t("common.previous")}
        className={`absolute top-1/2 transform -translate-y-1/2 z-10 p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-full shadow-lg shadow-black/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
          isRtl ? "right-4" : "left-4"
        }`}
      >
        {isRtl ? (
          <ChevronRight className="h-6 w-6 text-white" />
        ) : (
          <ChevronLeft className="h-6 w-6 text-white" />
        )}
      </button>
      <button
        onClick={nextSlide}
        aria-label={isRtl ? t("common.previous") : t("common.next")}
        className={`absolute top-1/2 transform -translate-y-1/2 z-10 p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-full shadow-lg shadow-black/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
          isRtl ? "left-4" : "right-4"
        }`}
      >
        {isRtl ? (
          <ChevronLeft className="h-6 w-6 text-white" />
        ) : (
          <ChevronRight className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3" role="tablist" aria-label="carousel navigation">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/60 ${
              index === currentSlide
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
