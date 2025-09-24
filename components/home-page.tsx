"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";

export default function HomePage() {
  const { language, t, isRtl } = useLanguage();
  const router = useRouter();

  const handleSimpleMode = () => {
    router.push("/simple");
  };

  const handleAdvancedMode = () => {
    router.push("/advanced");
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute -top-32 right-1/3 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-24 left-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-10 h-32 w-32 rotate-45 rounded-xl bg-blue-500/20 animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-10 h-24 w-24 -rotate-12 rounded-xl bg-violet-500/20 animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        ></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
        <div
          className="absolute top-40 right-40 w-1 h-1 bg-cyan-400 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-40 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-2 h-2 bg-violet-400 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
          <div className="container mx-auto px-4 h-full flex flex-col pb-2">
          {/* Main Title Section - fixed height */}
            <div className="flex-0 h-[25%] pt-2 pb-1 text-center select-none mt-4">
              <h1 className="text-[clamp(20px,3vw,40px)] font-extrabold leading-[1.1] mb-3 tracking-tight">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                {t("homepage.title")}
              </span>
            </h1>

            <p className="text-[clamp(10px,1.2vw,14px)] text-white/80 leading-relaxed max-w-3xl mx-auto">
              {t("homepage.subtitle")}
            </p>
          </div>

          {/* Mode Selection Area - fills remaining space */}
            <div className="flex-1 h-[75%] grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 xl:gap-40 max-w-7xl mx-auto place-items-stretch items-stretch">
            {/* Simple Mode Card */}
            <div className="group relative h-full">
              <div className="relative h-full px-2">
                {/* Image Section */}
                  <div className="relative mb-8 h-[45%] min-h-[140px]">
                    <div className="relative w-full h-full">
                    {/* Original carousel-style laptop mockup */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-[130%] h-full bg-gray-800/60 rounded-2xl shadow-2xl ring-1 ring-white/10 transform rotate-[-8deg] group-hover:rotate-[-4deg] transition-transform duration-500 ease-out">
                      {/* Screen */}
                      <div className="absolute inset-3 bg-white rounded-lg overflow-hidden">
                        <img
                          src="/images/beginners/Gemini_Generated_Image_c7ds1sc7ds1sc7ds.png"
                          alt="Simple Mode Interface"
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
                    <div
                      className="absolute -bottom-6 -left-6 h-6 w-6 rounded-full bg-orange-500/80 blur-[1px] animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>
                </div>

                {/* Content Section - clean, centered without card */}
                <div className="relative z-10 h-[42%] flex flex-col items-center text-center">
                  <h3 className="text-[clamp(18px,2vw,22px)] font-bold text-white mb-3">
                    {t("homepage.simpleMode.title")}
                  </h3>
                  <div className="h-1.5 w-20 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mb-3"></div>
                  <p className="text-white/70 leading-relaxed mb-3 text-[clamp(11px,1.3vw,13px)] max-w-[36ch]">
                    {t("homepage.simpleMode.description")}
                  </p>

                  <Button
                    onClick={handleSimpleMode}
                    className="mt-2 w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white py-3 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30"
                  >
                    {t("homepage.simpleMode.button")}
                    {isRtl ? (
                      <ArrowLeft className="h-4 w-4 mr-2" />
                    ) : (
                      <ArrowRight className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Mode Card */}
            <div className="group relative h-full">
              <div className="relative h-full px-2">
                {/* Image Section */}
                <div className="relative mb-8 h-[45%] min-h-[140px]">
                    <div className="relative w-full h-full">
                    {/* Original carousel-style laptop mockup */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-[130%] h-full bg-gray-800/60 rounded-2xl shadow-2xl ring-1 ring-white/10 transform rotate-[8deg] group-hover:rotate-[4deg] transition-transform duration-500 ease-out">
                      {/* Screen */}
                      <div className="absolute inset-3 bg-white rounded-lg overflow-hidden">
                        <img
                          src="/images/beginners/Gemini_Generated_Image_dudzufdudzufdudz.png"
                          alt="Advanced Mode Interface"
                          className="w-full h-full object-cover"
                        />
                        {/* Screen overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>
                      {/* Laptop base */}
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-gray-700/70 rounded-full"></div>
                    </div>

                    {/* Floating elements */}
                    <div className="absolute -top-6 -right-6 h-8 w-8 rounded-full bg-cyan-500/80 blur-[1px] animate-pulse"></div>
                    <div
                      className="absolute -bottom-6 -left-6 h-6 w-6 rounded-full bg-blue-500/80 blur-[1px] animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>
                </div>

                {/* Content Section - clean, centered without card */}
                <div className="relative z-10 h-[42%] flex flex-col items-center text-center">
                  <h3 className="text-[clamp(18px,2vw,22px)] font-bold text-white mb-3">
                    {t("homepage.advancedMode.title")}
                  </h3>
                  <div className="h-1.5 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-3"></div>
                  <p className="text-white/70 leading-relaxed mb-3 text-[clamp(11px,1.3vw,13px)] max-w-[36ch]">
                    {t("homepage.advancedMode.description")}
                  </p>

                  <Button
                    onClick={handleAdvancedMode}
                    className="mt-2 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                  >
                    {t("homepage.advancedMode.button")}
                    {isRtl ? (
                      <ArrowLeft className="h-4 w-4 mr-2" />
                    ) : (
                      <ArrowRight className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
