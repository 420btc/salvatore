"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Clock, Mail, User, MessageSquare, ArrowRight, Menu, Home } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"

mapboxgl.accessToken = "pk.eyJ1IjoiNDIwYnRjIiwiYSI6ImNtOTN3ejBhdzByNjgycHF6dnVmeHl2ZTUifQ.Utq_q5wN6DHwpkn6rcpZdw"

export default function ContactoPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Datos del formulario:', formData)
    // Aquí iría la lógica para enviar el formulario
    alert('¡Mensaje enviado! Te contactaremos pronto.')
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  useEffect(() => {
    // Load Mapbox GL JS
    const script = document.createElement("script")
    script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
    script.onload = () => {
      const link = document.createElement("link")
      link.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
      link.rel = "stylesheet"
      document.head.appendChild(link)

      // Initialize map after CSS loads
      setTimeout(() => {
        initializeMap()
      }, 100)
    }
    document.head.appendChild(script)

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-4.5051361461464765, 36.62234853157594],
      zoom: 18,
      interactive: true,
      attributionControl: false,
    })

    map.current.on("load", () => {
      setMapLoaded(true)

      const el = document.createElement("div")
      el.className = "shoe-marker"
      el.innerHTML = `
        <div style="
          background: #d97706;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          border: 3px solid white;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M2 18h20l-2-6H4l-2 6zM12 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8 8H4c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1z"/>
          </svg>
        </div>
      `

      new mapboxgl.Marker(el).setLngLat([-4.5051361461464765, 36.62234853157594]).addTo(map.current)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <div className="bg-white rounded-full shadow-xl border border-gray-100 px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center" prefetch={false}>
            <Image
              src="/salvatore.png"
              alt="Salvatore Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="ml-2 text-xl font-bold text-gray-900 font-serif">Salvatore</span>
          </Link>
          <nav className="hidden lg:flex gap-6 items-center">
            <Link
              href="/#servicios"
              className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-600"
              prefetch={false}
            >
              Servicios
            </Link>
            <Link
              href="/#precios"
              className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-600"
              prefetch={false}
            >
              Precios
            </Link>
            <Link
              href="/contacto"
              className="text-sm font-medium hover:text-amber-600 transition-colors text-amber-600"
              prefetch={false}
            >
              Contacto
            </Link>
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-sm bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full px-4 py-2 font-medium border border-amber-200"
              asChild
            >
              <a href="tel:952374610">Llamar Ahora</a>
            </Button>
            <Button 
              className="text-sm bg-amber-600 text-white hover:bg-amber-700 rounded-full px-4 py-2 font-medium shadow-lg"
              onClick={() => window.location.href = '/#quote'}
            >
              Solicitar Presupuesto <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="lg:hidden flex items-center gap-1">
             <Button 
               variant="ghost" 
               className="p-2"
               onClick={() => window.location.href = '/'}
             >
               <Home className="h-10 w-10 text-amber-600" />
               <span className="sr-only">Home</span>
             </Button>
             <Button 
               variant="ghost" 
               className="p-2"
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             >
               <Menu className="h-12 w-12 text-amber-600" />
               <span className="sr-only">Toggle menu</span>
             </Button>
           </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-4 z-40">
            <nav className="flex flex-col gap-4 px-6">
              <Link
                href="/#servicios"
                className="text-lg font-medium hover:text-amber-600 transition-colors text-gray-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link
                href="/#precios"
                className="text-lg font-medium hover:text-amber-600 transition-colors text-gray-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Precios
              </Link>
              <Link
                href="/contacto"
                className="text-lg font-medium hover:text-amber-600 transition-colors text-amber-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="text-lg bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full px-6 py-3 font-medium border border-amber-200"
                  onClick={() => setMobileMenuOpen(false)}
                  asChild
                >
                  <a href="tel:952374610">Llamar Ahora</a>
                </Button>
                <Button 
                  className="text-lg bg-amber-600 text-white hover:bg-amber-700 rounded-full px-6 py-3 font-medium shadow-lg"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    window.location.href = '/#quote'
                  }}
                >
                  Solicitar Presupuesto <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Contacto</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos para cualquier consulta sobre nuestros servicios de reparación de calzado.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Dirección</h3>
                    <p className="text-gray-600">C. Rafael Quintana Rosado, 19</p>
                    <p className="text-gray-600">29620 Torremolinos, Málaga</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                    <a href="tel:952374610" className="text-amber-600 hover:text-amber-700 font-medium">
                      952 37 46 10
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Horarios de Atención</h3>
                    <div className="space-y-1 text-gray-600">
                      <p><span className="font-medium">Lunes a Viernes:</span> 9:00 - 14:00 / 17:00 - 19:30</p>
                      <p><span className="font-medium">Sábado:</span> 10:30 - 13:30</p>
                      <p><span className="font-medium">Domingo:</span> <span className="text-red-600">Cerrado</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ubicación</h2>
              <div className="rounded-xl shadow-lg border border-gray-200 overflow-hidden bg-gray-100 relative h-96">
                <div ref={mapContainer} className="w-full h-full" />
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">Cargando mapa...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Nombre completo
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tu nombre completo"
                      required
                      className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      required
                      className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Teléfono
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Tu número de teléfono"
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="inline h-4 w-4 mr-1" />
                    Mensaje
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Cuéntanos sobre tu calzado y qué tipo de reparación necesitas..."
                    rows={5}
                    required
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-colors"
                >
                  Enviar Mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Salvatore Shoes Repair. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 text-xs flex items-center justify-center gap-2">
              Web made by 
              <a 
                href="https://carlosfr.es" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 transition-colors"
              >
                carlosfr.es
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}