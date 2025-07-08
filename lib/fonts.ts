import localFont from "next/font/local"

export const cairo = localFont({
  src: [
    { path: "../public/fonts/Cairo-300.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/Cairo-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Cairo-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-cairo",
  display: "swap",
})

export const roboto = localFont({
  src: [
    { path: "../public/fonts/Roboto-300.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/Roboto-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../public/fonts/Roboto-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Roboto-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/Roboto-700.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/Roboto-700-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-roboto",
  display: "swap",
})

export const getFontFamily = (isRtl: boolean) =>
  isRtl ? "var(--font-cairo), sans-serif" : "var(--font-roboto), sans-serif"
