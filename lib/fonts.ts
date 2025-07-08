import localFont from "next/font/local";

export const cairo = localFont({
  src: [
    { path: "../public/fonts/Cairo-Light.ttf", weight: "300", style: "normal" },
    {
      path: "../public/fonts/Cairo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    { path: "../public/fonts/Cairo-Bold.ttf", weight: "700", style: "normal" },
    // { path: "../public/fonts/Cairo-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-cairo",
  display: "swap",
});

export const roboto = localFont({
  src: [
    {
      path: "../public/fonts/Roboto-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    { path: "../public/fonts/Roboto-Bold.ttf", weight: "700", style: "normal" },
    {
      path: "../public/fonts/Roboto-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});

export const getFontFamily = (isRtl: boolean) =>
  isRtl ? "var(--font-cairo), sans-serif" : "var(--font-roboto), sans-serif";
