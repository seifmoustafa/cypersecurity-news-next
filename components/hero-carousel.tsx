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
  const isRtl = language === "ar";

  const carouselItems = [
    {
      id: "comprehensive-platform",
      title: t("carousel.item1.title"),
      description: t("carousel.item1.description"),
      image: "/images/beginners/Gemini_Generated_Image_c7ds1sc7ds1sc7ds.png",
      primaryButton: t("carousel.item1.primaryButton"),
      secondaryButton: t("carousel.item1.secondaryButton"),
      primaryAction: () => router.push("/advanced"),
      secondaryAction: () => router.push("/simple"),
    },
    {
      id: "security-awareness",
      title: t("carousel.item2.title"),
      description: t("carousel.item2.description"),
      image: "/images/beginners/Gemini_Generated_Image_dudzufdudzufdudz.png",
      primaryButton: t("carousel.item2.primaryButton"),
      secondaryButton: t("carousel.item2.secondaryButton"),
      primaryAction: () => router.push("/advanced"),
      secondaryAction: () => router.push("/simple"),
    },
    {
      id: "personal-protection",
      title: t("carousel.item3.title"),
      description: t("carousel.item3.description"),
      image: "/images/beginners/Gemini_Generated_Image_ry6ctary6ctary6c.png",
      primaryButton: t("carousel.item3.primaryButton"),
      secondaryButton: t("carousel.item3.secondaryButton"),
      primaryAction: () => router.push("/advanced"),
      secondaryAction: () => router.push("/simple"),
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

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
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background geometric shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500 rotate-45 transform"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-purple-500 rotate-12 transform"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-cyan-500 rotate-45 transform"></div>
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
            <div className="flex h-full">
              {/* Content Section */}
              <div className={`flex-1 flex flex-col justify-center p-12 ${isRtl ? "order-2" : "order-1"}`}>
                <div className="max-w-2xl">
                  {/* Title with gradient colors */}
                  <h1 className="text-5xl font-bold leading-tight mb-6">
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
                  <p className="text-white text-lg leading-relaxed mb-8 max-w-xl">
                    {item.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={item.primaryAction}
                      className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {item.primaryButton}
                    </Button>
                    <Button
                      onClick={item.secondaryAction}
                      variant="ghost"
                      className="text-white hover:text-pink-400 px-8 py-4 text-lg font-semibold transition-all duration-300 flex items-center gap-2"
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
              <div className={`flex-1 flex items-center justify-center p-8 ${isRtl ? "order-1" : "order-2"}`}>
                <div className="relative">
                  {/* Laptop mockup */}
                  <div className="relative w-96 h-64 bg-gray-800 rounded-lg shadow-2xl transform rotate-[-8deg] hover:rotate-[-5deg] transition-transform duration-500">
                    {/* Screen */}
                    <div className="absolute inset-2 bg-white rounded-md overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Screen overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    
                    {/* Laptop base */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-80 h-2 bg-gray-700 rounded-full"></div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-500 rounded-full opacity-80 animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-500 rounded-full opacity-80 animate-pulse" style={{ animationDelay: "1s" }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 ${
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
        className={`absolute top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 ${
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
