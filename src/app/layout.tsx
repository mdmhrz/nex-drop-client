import { Urbanist } from "next/font/google"

import "./globals.css"
import "../lib/env"


import { ThemeProvider } from "@/provider/theme-provider";
import { ReactQueryProvider } from "@/provider/react-query-provider";
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

export const metadata = {
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
}

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
          <ReactQueryProvider>
            {children}
            <Toaster position="top-right" richColors />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
