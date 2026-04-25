import { Urbanist } from "next/font/google"

import "./globals.css"
import "../lib/env"


import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const urbanist = Urbanist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const urbanistHeading = Urbanist({
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
      className={cn("antialiased", urbanist.variable, urbanistHeading.variable)}
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
