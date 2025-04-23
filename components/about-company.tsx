"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function AboutCompany() {
  const [aboutRef, aboutInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Variants for animations
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section ref={aboutRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={aboutInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariant}>
            <Badge className="mb-4 px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full">Про нас</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">АГРО-СОЛАР — офіційний імпортер CEAT в Україні</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Ми працюємо з 2015 року, забезпечуючи українських аграріїв якісними шинами від індійського виробника CEAT.
              Наша компанія гарантує прямі поставки, офіційну гарантію та професійний сервіс.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-1">8+</div>
                <div className="text-sm text-gray-600">років на ринку</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-1">1000+</div>
                <div className="text-sm text-gray-600">задоволених клієнтів</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-1">24/7</div>
                <div className="text-sm text-gray-600">технічна підтримка</div>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Детальніше про нас
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div variants={itemVariant} className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image src="/ceat-tire-warehouse.png" alt="Склад шин CEAT" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Сертифікований партнер CEAT</h3>
                <p className="text-gray-700">
                  Ми є ексклюзивним постачальником шин CEAT для сільськогосподарської техніки в Україні
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
