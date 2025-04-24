"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronRight, Phone, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function Hero() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()

  // Parallax effect for hero section
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  return (
    <section ref={heroRef} className="relative h-[90vh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: heroY }}>
        <Image src="/field-tractor-ceat.png" alt="Трактор з шинами CEAT" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </motion.div>

      <motion.div
        className="container relative h-full flex flex-col justify-center px-4 md:px-6"
        style={{ opacity: heroOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Badge className="mb-6 px-4 py-2 text-sm bg-orange-500 text-white border-none">
            Офіційний імпортер в Україні
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-3xl mb-6 leading-tight">
            CEAT — Надійні шини для вашої техніки
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-10 leading-relaxed">
            Індійська якість, перевірена українськими аграріями
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop">
              <Button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-7 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Дивитись каталог
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 px-8 py-7 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Залишити заявку
              <Phone className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <ChevronDown className="h-10 w-10 text-white/70" />
          </motion.div>
        </div>
      </motion.div>

      {/* Curved divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}
