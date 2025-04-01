import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prognoza Pogody",
  description: "Sprawdź prognozę pogody dla dowolnej lokalizacji",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Prognoza Pogody",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Prognoza Pogody",
    title: "Prognoza Pogody",
    description: "Sprawdź prognozę pogody dla dowolnej lokalizacji",
  },
  twitter: {
    card: "summary",
    title: "Prognoza Pogody",
    description: "Sprawdź prognozę pogody dla dowolnej lokalizacji",
  },
  icons: {
    icon: [
      { url: "https://placehold.co/16x16/3b82f6/FFFFFF.png?text=W", sizes: "16x16", type: "image/png" },
      { url: "https://placehold.co/32x32/3b82f6/FFFFFF.png?text=W", sizes: "32x32", type: "image/png" },
      { url: "https://placehold.co/192x192/3b82f6/FFFFFF.png?text=Weather", sizes: "192x192", type: "image/png" },
      { url: "https://placehold.co/512x512/3b82f6/FFFFFF.png?text=Weather", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "https://placehold.co/152x152/3b82f6/FFFFFF.png?text=Weather", sizes: "152x152", type: "image/png" },
      { url: "https://placehold.co/180x180/3b82f6/FFFFFF.png?text=Weather", sizes: "180x180", type: "image/png" },
      { url: "https://placehold.co/167x167/3b82f6/FFFFFF.png?text=Weather", sizes: "167x167", type: "image/png" },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        {/* Standard icon for iOS */}
        <link rel="apple-touch-icon" href="https://placehold.co/192x192/3b82f6/FFFFFF.png?text=Weather" />

        {/* Icons for different iOS device sizes */}
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="https://placehold.co/152x152/3b82f6/FFFFFF.png?text=Weather"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://placehold.co/180x180/3b82f6/FFFFFF.png?text=Weather"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="https://placehold.co/167x167/3b82f6/FFFFFF.png?text=Weather"
        />

        {/* Standard favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="https://placehold.co/32x32/3b82f6/FFFFFF.png?text=W" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://placehold.co/16x16/3b82f6/FFFFFF.png?text=W" />

        {/* Alternative manifest format */}
        <link rel="manifest" href="/app.webmanifest" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Prognoza Pogody" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <script src="/register-sw.js" defer></script>
      </body>
    </html>
  )
}



import './globals.css'