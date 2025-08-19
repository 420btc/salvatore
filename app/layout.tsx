import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Salvatore Shoes Repair - Reparación de Calzado en Torremolinos",
  description:
    "Taller especializado en reparación de calzado con más de 30 años de experiencia. Suelas, tacones, cuero. Torremolinos, Málaga.",
  icons: {
    icon: "/salvatore.png",
    shortcut: "/salvatore.png",
    apple: "/salvatore.png",
  },
  openGraph: {
    title: "Salvatore Shoes Repair - Reparación de Calzado en Torremolinos",
    description: "Taller especializado en reparación de calzado con más de 30 años de experiencia. Suelas, tacones, cuero. Torremolinos, Málaga.",
    images: ["/salvatore.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salvatore Shoes Repair - Reparación de Calzado en Torremolinos",
    description: "Taller especializado en reparación de calzado con más de 30 años de experiencia. Suelas, tacones, cuero. Torremolinos, Málaga.",
    images: ["/salvatore.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style suppressHydrationWarning>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
