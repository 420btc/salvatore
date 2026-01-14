import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from '@vercel/analytics/react'
import "./globals.css"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://salvatorerepair.es'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Salvatore Shoes Repair - Reparación de Calzado en Torremolinos | Málaga",
    template: "%s | Salvatore Shoes Repair"
  },
  description: "Taller especializado en reparación de calzado con más de 30 años de experiencia en Torremolinos, Málaga. Reparamos suelas, tacones, cuero y todo tipo de calzado. Servicio profesional y garantizado.",
  keywords: [
    "reparación calzado",
    "zapatero Torremolinos",
    "reparar zapatos Málaga",
    "suelas",
    "tacones",
    "cuero",
    "Salvatore",
    "zapatería",
    "arreglo zapatos",
    "Costa del Sol"
  ],
  authors: [{ name: "Salvatore Shoes Repair" }],
  creator: "Salvatore Shoes Repair",
  publisher: "Salvatore Shoes Repair",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/salvatore.png",
    shortcut: "/salvatore.png",
    apple: "/salvatore.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: baseUrl,
    siteName: "Salvatore Shoes Repair",
    title: "Salvatore Shoes Repair - Reparación de Calzado en Torremolinos | Málaga",
    description: "Taller especializado en reparación de calzado con más de 30 años de experiencia en Torremolinos, Málaga. Reparamos suelas, tacones, cuero y todo tipo de calzado.",
    images: [
      {
        url: "/salvatore.png",
        width: 1200,
        height: 630,
        alt: "Salvatore Shoes Repair - Taller de reparación de calzado en Torremolinos"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salvatore Shoes Repair - Reparación de Calzado en Torremolinos",
    description: "Taller especializado en reparación de calzado con más de 30 años de experiencia en Torremolinos, Málaga.",
    images: ["/salvatore.png"],
    creator: "@SalvatoreShoes",
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'es-ES': baseUrl,
      'en-US': `${baseUrl}/en`,
    },
  },
  category: "business",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}#business`,
    "name": "Salvatore Shoes Repair",
    "alternateName": "Salvatore Reparación de Calzado",
    "description": "Taller especializado en reparación de calzado con más de 30 años de experiencia en Torremolinos, Málaga. Reparamos suelas, tacones, cuero y todo tipo de calzado.",
    "url": baseUrl,
    "telephone": "+34-722-53-35-30",
    "email": "info@salvatoreshoes.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle Rafael Quintana Rosado, 19",
      "addressLocality": "Torremolinos",
      "addressRegion": "Andalucía",
      "postalCode": "29620",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 36.6201,
      "longitude": -4.4996
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "10:00",
        "closes": "14:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "18:00",
        "closes": "20:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:30",
        "closes": "13:30"
      }
    ],
    "image": `${baseUrl}/salvatore.png`,
    "logo": `${baseUrl}/salvatore.png`,
    "priceRange": "€€",
    "currenciesAccepted": "EUR",
    "paymentAccepted": "Cash, Credit Card",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 36.6201,
        "longitude": -4.4996
      },
      "geoRadius": "50000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de Reparación de Calzado",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reparación de Suelas",
            "description": "Cambio y reparación de suelas de todo tipo de calzado"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reparación de Tacones",
            "description": "Cambio y arreglo de tacones para zapatos de mujer"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reparación de Cuero",
            "description": "Restauración y reparación de artículos de cuero"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "foundingDate": "1990",
    "slogan": "Más de 30 años dando vida a tu calzado"
  }

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <style suppressHydrationWarning>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
