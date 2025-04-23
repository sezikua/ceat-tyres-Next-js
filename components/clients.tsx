"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Clients() {
  const [clientsRef, clientsInView] = useInView({
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
    <section ref={clientsRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={clientsInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-1.5 bg-green-100 text-green-800 rounded-full">Клієнти</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Для кого ми працюємо</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Наші шини використовуються різними категоріями клієнтів у сільськогосподарському секторі
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={clientsInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            {
              name: "Фермерські господарства",
              icon: "🚜",
              description: "Малі та середні фермерські господарства, що цінують надійність та економічність",
            },
            {
              name: "Дистриб'ютори",
              icon: "🏢",
              description: "Офіційні дилери сільськогосподарської техніки та комплектуючих",
            },
            {
              name: "Агрохолдинги",
              icon: "🌾",
              description: "Великі агропромислові компанії з власним парком техніки",
            },
            {
              name: "Механізатори",
              icon: "👨‍🔧",
              description: "Професіонали, які працюють з сільськогосподарською технікою щодня",
            },
          ].map((client, index) => (
            <motion.div
              key={index}
              variants={itemVariant}
              className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-6">{client.icon}</div>
              <h3 className="text-xl font-bold mb-3">{client.name}</h3>
              <p className="text-gray-600">{client.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={clientsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Станьте нашим партнером</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Приєднуйтесь до мережі офіційних дилерів CEAT в Україні та отримайте вигідні умови співпраці
          </p>
          <Button
            variant="outline"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Дізнатися більше про партнерство
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
