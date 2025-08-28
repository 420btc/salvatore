import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.vercel.app'

export const metadata: Metadata = {
  title: "Contacto - Salvatore Shoes Repair | Torremolinos, Málaga",
  description: "Contacta con Salvatore Shoes Repair en Torremolinos. Horarios: L-V 10:00-14:00 y 18:00-20:30, S 10:30-13:30. Teléfono, ubicación y formulario de contacto.",
  keywords: [
    "contacto zapatero Torremolinos",
    "horarios Salvatore Shoes",
    "teléfono reparación calzado",
    "ubicación zapatería Málaga",
    "formulario contacto",
    "dirección taller calzado"
  ],
  openGraph: {
    title: "Contacto - Salvatore Shoes Repair | Torremolinos, Málaga",
    description: "Contacta con nuestro taller de reparación de calzado en Torremolinos. Horarios, teléfono, ubicación y formulario de contacto.",
    url: `${baseUrl}/contacto`,
    type: "website",
    images: [
      {
        url: "/salvatore.png",
        width: 1200,
        height: 630,
        alt: "Contacto Salvatore Shoes Repair Torremolinos"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto - Salvatore Shoes Repair | Torremolinos",
    description: "Contacta con nuestro taller de reparación de calzado en Torremolinos. Horarios, teléfono y ubicación.",
    images: ["/salvatore.png"],
  },
  alternates: {
    canonical: `${baseUrl}/contacto`,
  },
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}