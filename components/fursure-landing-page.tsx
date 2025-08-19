"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Wrench, XCircle, CheckCircle, ArrowRight, Menu, MapPin, Phone, Clock, Home, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"

// Componente para mostrar el estado actual de la tienda
function StoreStatus() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const dayOfWeek = now.getDay() // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
      const currentTimeInMinutes = currentHour * 60 + currentMinute
      
      // Formatear hora actual
      setCurrentTime(now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      }))
      
      let storeIsOpen = false
      
      if (dayOfWeek === 0) {
        // Domingo - Cerrado
        storeIsOpen = false
      } else if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Lunes a Viernes: 9:00-14:00 y 17:00-19:30
        const morningStart = 9 * 60 // 9:00
        const morningEnd = 14 * 60 // 14:00
        const afternoonStart = 17 * 60 // 17:00
        const afternoonEnd = 19 * 60 + 30 // 19:30
        
        storeIsOpen = (currentTimeInMinutes >= morningStart && currentTimeInMinutes < morningEnd) ||
                     (currentTimeInMinutes >= afternoonStart && currentTimeInMinutes < afternoonEnd)
      } else if (dayOfWeek === 6) {
        // Sábado: 10:30-13:30
        const saturdayStart = 10 * 60 + 30 // 10:30
        const saturdayEnd = 13 * 60 + 30 // 13:30
        
        storeIsOpen = currentTimeInMinutes >= saturdayStart && currentTimeInMinutes < saturdayEnd
      }
      
      setIsOpen(storeIsOpen)
    }
    
    // Actualizar inmediatamente
    updateStatus()
    
    // Actualizar cada segundo para mostrar reloj en tiempo real
    const interval = setInterval(updateStatus, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-md ${
      isOpen 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <Clock className="h-4 w-4" />
      <span className="font-semibold">{currentTime}</span>
      <span className="mx-1">•</span>
      <span className={`font-bold ${
        isOpen ? 'text-green-700' : 'text-red-700'
      }`}>
        {isOpen ? 'ABIERTO' : 'CERRADO'}
      </span>
    </div>
  )
}

mapboxgl.accessToken = "pk.eyJ1IjoiNDIwYnRjIiwiYSI6ImNtOTN3ejBhdzByNjgycHF6dnVmeHl2ZTUifQ.Utq_q5wN6DHwpkn6rcpZdw"

export default function SalvatoreShoeRepairPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mapVisible, setMapVisible] = useState(true)

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
      center: [0, 0],
      zoom: 1,
      interactive: false, // Disable interaction initially for mobile
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

      setTimeout(() => {
        map.current.flyTo({
          center: [-4.5051361461464765, 36.62234853157594],
          zoom: 18,
          duration: 3000,
          essential: true,
        })

        setTimeout(() => {
          map.current.scrollZoom.enable()
          map.current.boxZoom.enable()
          map.current.dragRotate.enable()
          map.current.dragPan.enable()
          map.current.keyboard.enable()
          map.current.doubleClickZoom.enable()
          map.current.touchZoomRotate.enable()
        }, 3500)
      }, 1000)
    })
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <div className="bg-white rounded-full shadow-xl border border-gray-100 px-6 py-3 flex items-center justify-between">
          <Link href="#" className="flex items-center justify-center" prefetch={false}>
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
              href="#servicios"
              className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-600"
              prefetch={false}
            >
              Servicios
            </Link>
            <Link
              href="#precios"
              className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-600"
              prefetch={false}
            >
              Precios
            </Link>
            <Link
              href="#contacto"
              className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-600"
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
            <Button className="text-sm bg-amber-600 text-white hover:bg-amber-700 rounded-full px-4 py-2 font-medium shadow-lg">
              Solicitar Presupuesto <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="lg:hidden flex items-center gap-1">
             <Button 
               variant="ghost" 
               className="p-2"
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
                href="#servicios"
                className="text-lg font-medium hover:text-amber-600 transition-colors text-gray-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link
                href="#precios"
                className="text-lg font-medium hover:text-amber-600 transition-colors text-gray-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Precios
              </Link>
              <Link
                href="#contacto"
                className="text-lg font-medium hover:text-amber-600 transition-colors text-gray-600 py-2"
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
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Solicitar Presupuesto <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main content without padding to show hero image directly under header */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative bg-gradient-to-br from-amber-50 via-white to-amber-50/30">
          <div className="absolute inset-0 z-0">
            <Image
              src="/herop.png"
              alt="Hero background"
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-white/60 to-amber-50/30 z-10"></div>
          <div className={`container px-4 md:px-6 text-center relative z-20 ${!mapVisible ? 'pt-20' : ''}`}>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 mb-4 shadow-lg">
                ✨ Más de 30 años reparando calzado en Torremolinos
              </div>
              <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl text-gray-900 font-serif md:text-7xl">
                Salvatore Shoes Repair
              </h1>
              <p className="text-lg text-gray-600 md:text-xl max-w-2xl mx-auto">
                Taller especializado en reparación de calzado. Devolvemos la vida a tus zapatos favoritos con técnicas
                tradicionales y materiales de primera calidad. Tu calzado en las mejores manos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="text-white hover:bg-amber-700 bg-amber-600 shadow-xl px-8 py-3">
                  Solicitar Presupuesto <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 px-8 py-3 bg-transparent shadow-lg"
                >
                  Ver Ubicación
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-600 mt-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>952 37 46 10</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>C. Rafael Quintana Rosado, 19, Torremolinos</span>
                </div>
              </div>
            </div>

            {mapVisible && (
              <div className="mt-12 md:mt-16">
                <div className="mx-auto rounded-xl shadow-2xl border border-gray-200 overflow-hidden bg-gray-100 relative">
                  {/* Botón para ocultar mapa */}
                  <button
                    onClick={() => setMapVisible(false)}
                    className="absolute top-2 right-2 z-30 bg-amber-600 hover:bg-amber-700 rounded-full p-1 md:p-2 shadow-lg transition-all duration-200 hover:scale-110"
                    title="Ocultar mapa"
                  >
                    <X className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </button>
                  <div ref={mapContainer} className="w-full h-[400px] md:h-[500px]" style={{ minHeight: "400px" }} />
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
                        <p className="text-gray-600 text-sm">Cargando ubicación...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Horarios Section */}
        <section className="w-full py-12 bg-white border-b border-gray-100">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 font-serif italic">Horarios de Atención</h3>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-gray-50 rounded-lg p-4 shadow-md">
                  <h4 className="font-semibold text-gray-900 mb-3">Lunes a Viernes</h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Mañana:</span>
                      <span>9:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarde:</span>
                      <span>17:00 - 19:30</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 shadow-md">
                  <h4 className="font-semibold text-gray-900 mb-3">Sábado</h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Mañana:</span>
                      <span>10:30 - 13:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarde:</span>
                      <span className="text-red-600">Cerrado</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4 p-4 bg-red-50 rounded-lg shadow-md">
                <p className="text-red-700 font-medium">Domingos: Cerrado</p>
              </div>
              
              {/* Estado Actual de la Tienda */}
              <div className="text-center mt-6">
                <StoreStatus />
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="max-w-xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-gray-900 font-serif italic">
                ¿Tus Zapatos Necesitan Atención?
              </h2>
              <p className="mt-4 text-gray-600">
                No tires tus zapatos favoritos. En Salvatore les damos una segunda vida con reparaciones profesionales.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <XCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Suelas Desgastadas</h3>
                <p className="text-gray-600">
                  ¿Se han gastado las suelas de tus zapatos favoritos? Les damos nueva vida.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <XCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Tacones Rotos</h3>
                <p className="text-gray-600">Reparamos y cambiamos tacones de todo tipo con materiales de calidad.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <XCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Cuero Dañado</h3>
                <p className="text-gray-600">
                  Restauramos el cuero dañado y devolvemos el brillo original a tu calzado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-gray-900 font-serif italic">
                Nuestros Servicios Especializados
              </h2>
              <p className="mt-4 text-gray-600">
                Más de 30 años de experiencia nos avalan. Ofrecemos servicios completos de reparación de calzado.
              </p>
            </div>
            <div className="grid gap-12 md:gap-16">
              {/* Service 1 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Image
                  src="/suela.jpg"
                  alt="Reparación de Suelas"
                  width={500}
                  height={400}
                  className="rounded-xl shadow-2xl mx-auto border border-gray-200"
                />
                <div>
                  <div className="inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 mb-2 shadow-md">
                    <Wrench className="inline-block h-4 w-4 mr-1" /> Reparación de Suelas
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Suelas Como Nuevas</h3>
                  <p className="text-gray-600 mb-4">
                    Cambiamos y reparamos suelas de todo tipo de calzado. Utilizamos materiales de primera calidad que
                    garantizan durabilidad y comodidad.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-amber-600 mr-2" /> Suelas de cuero y goma
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-amber-600 mr-2" /> Reparación de medias suelas
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-amber-600 mr-2" /> Garantía en todos los trabajos
                    </li>
                  </ul>
                </div>
              </div>
              {/* Service 2 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-last">
                  <Image
                    src="/tacones.jpeg"
                    alt="Reparación de Tacones"
                    width={500}
                    height={400}
                    className="rounded-xl shadow-2xl mx-auto border border-gray-200"
                  />
                </div>
                <div>
                  <div className="inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 mb-2 shadow-md">
                    <Wrench className="inline-block h-4 w-4 mr-1" /> Reparación de Tacones
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Tacones Perfectos</h3>
                  <p className="text-gray-600 mb-4">
                    Especialistas en reparación y cambio de tacones. Desde tacones altos hasta zapatos de vestir,
                    devolvemos la elegancia a tu calzado.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-amber-600 mr-2" /> Tacones de aguja y plataforma
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-amber-600 mr-2" /> Cambio de puntas y tapas
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-amber-600 mr-2" /> Ajuste de altura
                    </li>
                  </ul>
                </div>
              </div>
              {/* Service 3 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Image
                  src="/cuero.jpg"
                  alt="Restauración de Cuero"
                  width={500}
                  height={400}
                  className="rounded-xl shadow-2xl mx-auto border border-gray-200"
                />
                <div>
                  <div className="inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 mb-2 shadow-md">
                    <Wrench className="inline-block h-4 w-4 mr-1" /> Restauración de Cuero
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Cuero Como Nuevo</h3>
                  <p className="text-gray-600 mb-4">
                    Restauramos el cuero dañado, arañazos, decoloraciones y grietas. Tu calzado recuperará su aspecto
                    original.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-amber-600 mr-2" /> Limpieza y nutrición del cuero
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-amber-600 mr-2" /> Reparación de arañazos
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-amber-600 mr-2" /> Teñido y restauración de color
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precios" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="max-w-xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-gray-900 font-serif italic">Precios Transparentes</h2>
              <p className="mt-4 text-gray-600">
                Precios justos por un trabajo de calidad. Presupuesto sin compromiso.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              <Card className="shadow-lg border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">Servicios Básicos</CardTitle>
                  <CardDescription className="text-gray-600">Reparaciones esenciales para tu calzado.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex justify-between items-center">
                      <span>Media suela</span>
                      <span className="font-semibold">15€ - 25€</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Cambio de tacón</span>
                      <span className="font-semibold">8€ - 15€</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Punta de tacón</span>
                      <span className="font-semibold">3€ - 5€</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Limpieza básica</span>
                      <span className="font-semibold">5€ - 8€</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-amber-600 text-white hover:bg-amber-700 shadow-lg">
                    Solicitar Presupuesto <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-2 border-amber-300 relative bg-gradient-to-br from-amber-50 to-white">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
                  Más Solicitado
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">Servicios Premium</CardTitle>
                  <CardDescription className="text-gray-600">
                    Restauración completa y servicios especializados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex justify-between items-center">
                      <span>Suela completa</span>
                      <span className="font-semibold">25€ - 45€</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Restauración cuero</span>
                      <span className="font-semibold">20€ - 35€</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Teñido completo</span>
                      <span className="font-semibold">15€ - 25€</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Reparación cremalleras</span>
                      <span className="font-semibold">10€ - 18€</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-amber-600 text-white hover:bg-amber-700 shadow-lg">
                    Solicitar Presupuesto <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-amber-300 rounded-full blur-lg"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-12 h-12 bg-amber-200 rounded-full blur-lg"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-400 rounded-full blur-3xl"></div>
          </div>

          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="container px-4 md:px-6 text-center relative z-10">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-serif italic">
              ¿Listos para Darle Nueva Vida a tus Zapatos?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-amber-100">
              Más de 30 años de experiencia nos avalan. Ven a visitarnos o llámanos para un presupuesto sin compromiso.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-amber-700 hover:bg-gray-100 shadow-xl" asChild>
                <a href="tel:952374610">Llamar Ahora: 952 37 46 10 <Phone className="ml-2 h-5 w-5" /></a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-700 bg-transparent"
              >
                Ver Ubicación <MapPin className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 font-serif italic">
              Preguntas Frecuentes
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-amber-600">
                  ¿Qué tipos de calzado reparan?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Reparamos todo tipo de calzado: zapatos de vestir, deportivos, botas, sandalias, tacones altos,
                  zapatos de seguridad y más. Si tiene suela, ¡lo reparamos!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-amber-600">
                  ¿Cuánto tiempo tardan las reparaciones?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Dependiendo del tipo de reparación, entre 2-7 días laborables. Las reparaciones simples como cambio de
                  puntas de tacón pueden estar listas en 24-48 horas.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-amber-600">
                  ¿Ofrecen garantía en sus trabajos?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Sí, todos nuestros trabajos tienen garantía. La duración depende del tipo de reparación, pero
                  generalmente ofrecemos entre 3-6 meses de garantía.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-amber-600">
                  ¿Necesito cita previa?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  No es necesario, pero recomendamos llamar antes para asegurar que podemos atenderle inmediatamente y
                  tener el presupuesto listo.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-amber-600">
                  ¿Qué formas de pago aceptan?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Aceptamos efectivo y tarjeta. El pago se realiza al recoger el calzado una vez completada la
                  reparación.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        </main>

      {/* Footer */}
      <footer
        id="contacto"
        className="bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 text-gray-800 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="footerGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#d97706" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#footerGrid)" />
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 right-20 w-16 h-16 bg-amber-200 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-12 h-12 bg-yellow-200 rounded-full blur-lg"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-8 md:py-10 relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <Image
                  src="/salvatore.png"
                  alt="Salvatore Logo"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
                <span className="ml-2 text-2xl font-bold text-gray-800 font-serif">Salvatore</span>
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Taller especializado en reparación de calzado con más de 30 años de experiencia en Torremolinos.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>952 37 46 10</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>C. Rafael Quintana Rosado, 19</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>29620 Torremolinos, Málaga</span>
                </div>
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#servicios" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Reparación de Suelas
                  </Link>
                </li>
                <li>
                  <Link href="#servicios" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Cambio de Tacones
                  </Link>
                </li>
                <li>
                  <Link href="#servicios" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Restauración de Cuero
                  </Link>
                </li>
                <li>
                  <Link href="#servicios" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Limpieza y Nutrición
                  </Link>
                </li>
              </ul>
            </div>

            {/* Info Links */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-4">Información</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#precios" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Horarios
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Ubicación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-4">Horarios</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <div className="font-medium">Lun - Vie</div>
                  <div>9:00-14:00 / 17:00-19:30</div>
                </li>
                <li>
                  <div className="font-medium">Sábado</div>
                  <div>10:30-13:30</div>
                </li>
                <li>
                  <div className="font-medium">Domingo</div>
                  <div className="text-red-600">Cerrado</div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-amber-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Salvatore Shoes Repair. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <span className="text-gray-500">Torremolinos, Málaga</span>
              <span className="text-gray-500">Calidad desde 1990</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
