"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Badge } from "@/components/ui/badge"

export function Advantages() {
  const [advantagesRef, advantagesInView] = useInView({
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
    <section ref={advantagesRef} className="py-20">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={advantagesInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full">Переваги</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Чому обирають шини CEAT</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Наші шини розроблені з урахуванням потреб сучасного сільського господарства, забезпечуючи оптимальну
            продуктивність у будь-яких умовах
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={advantagesInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            {
              title: "Висока зносостійкість",
              description: "Тривалий термін експлуатації навіть у складних умовах",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              color: "blue",
            },
            {
              title: "Оптимальна тиск-несучість",
              description: "Мінімальний вплив на структуру ґрунту",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ),
              color: "green",
            },
            {
              title: "Сумісність із технікою",
              description: "John Deere, Case, New Holland та інші",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              color: "yellow",
            },
            {
              title: "Вигідна ціна / Якість",
              description: "Оптимальне співвідношення для українського ринку",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              color: "red",
            },
          ].map((advantage, index) => (
            <motion.div
              key={index}
              variants={itemVariant}
              className={`flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-b-4 border-${advantage.color}-500 group hover:-translate-y-2`}
            >
              <div
                className={`w-16 h-16 flex items-center justify-center bg-${advantage.color}-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {advantage.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
