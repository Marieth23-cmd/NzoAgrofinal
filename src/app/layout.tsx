import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from 'next/font/google'



const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: "NzoAgro",
  description: "Plataforma de Conexão Agrícola",
  themeColor: "#00A651",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
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
    <html lang="en">
      
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

