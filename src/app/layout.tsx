
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from 'next/font/google'
import Image from 'next/image'
import ServiceWorkerRegistry from './Components/ServiceWorkerRegistry'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "NzoAgro",
  description: "Plataforma de Conexão Agrícola",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#4CAF50",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4CAF50" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ServiceWorkerRegistry />
        <div className="fixed top-0 left-0 p-4 z-50">
          <Image
            src="/images/logo.jpg"
            alt="NzoAgro Logo"
            width={120}
            height={40}
            priority
            className="object-contain"
          />
        </div>
        {children}
      </body>
    </html>
  );
}