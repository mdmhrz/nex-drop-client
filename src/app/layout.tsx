import { Geist_Mono, Noto_Sans, Outfit } from "next/font/google"

import "./globals.css"
import "./src/lib/env"

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

const notoSans = Noto_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
})

const outfitHeading = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, notoSans.variable, outfitHeading.variable)}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
