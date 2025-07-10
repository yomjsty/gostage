import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { ReactQueryProvider } from "./react-query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gostage.vercel.app"),
  title: {
    default: "GoStage",
    template: "%s - GoStage",
  },
  description: "The easiest and cheapest ticket purchase is only at GoStage.",
  keywords: ["event ticket", "buy ticket", "GoStage", "online event", "cheap ticket"],
  authors: [{ name: "GoStage Team", url: "https://gostage.vercel.app" }],
  openGraph: {
    title: "GoStage",
    description: "The easiest and cheapest ticket purchase is only at GoStage.",
    url: "https://gostage.vercel.app",
    siteName: "GoStage",
    images: [
      {
        url: "/logo-square.png",
        width: 1200,
        height: 630,
        alt: "GoStage",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoStage",
    description: "The easiest and cheapest ticket purchase is only at GoStage.",
    images: ["/logo-square.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="google-site-verification" content="tU6KZzz81yDUZm_Sjer9t_8C6RprNr7EuBRZUwPkHME" />
      <body
        className={`${inter.variable} ${jetBrainsMono.variable}  antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <NextSSRPlugin
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <main>{children}</main>
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
