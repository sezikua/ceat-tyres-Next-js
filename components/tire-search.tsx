"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { TyreSizeFilter } from "@/components/tire-size-filter"

export function TireSearch() {
  const [searchRef, searchInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Variants for animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section ref={searchRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={searchInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Пошук шин по розміру</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Оберіть розмір шини, і ми покажемо всі доступні моделі CEAT для ваших потреб
          </p>
        </motion.div>

        <motion.div initial="hidden" animate={searchInView ? "visible" : "hidden"} variants={fadeInUp}>
          <TyreSizeFilter />
        </motion.div>
      </div>
    </section>
  )
}
