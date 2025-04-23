"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Categories() {
  const [categoriesRef, categoriesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Variants for animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

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
    <section ref={categoriesRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={categoriesInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-1.5 bg-orange-100 text-orange-800 rounded-full">Асортимент</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Категорії шин</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Широкий вибір шин для різних типів сільськогосподарської техніки та умов експлуатації
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={categoriesInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
        >
          {[
            { name: "Передні тракторні", image: "/images/front-tractor-tires.webp" },
            { name: "Задні тракторні", image: "/images/rear-tractor-tires.webp" },
            { name: "Шини для причепів", image: "/images/trailer-tires.webp" },
            { name: "Для обприскувачів", image: "/images/sprayer-tires.webp" },
            { name: "VF-технології", image: "/images/vf-technology-tires.webp" },
          ].map((category, index) => (
            <motion.div key={index} variants={itemVariant}>
              <Link href={`/products/${category.name.toLowerCase().replace(/\s+/g, "-")}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <ArrowRight className="text-white ml-auto h-6 w-6" />
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-lg group-hover:text-orange-500 transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            Переглянути всі категорії
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
