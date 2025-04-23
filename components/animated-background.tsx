"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

interface AnimatedBackgroundProps {
  className?: string
}

export function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const cities = [
    "Київ",
    "Вінниця",
    "Жмеринка",
    "Могилів-Подільський",
    "Козятин",
    "Хмільник",
    "Луцьк",
    "Ковель",
    "Нововолинськ",
    "Дніпро",
    "Кривий Ріг",
    "Нікополь",
    "Павлоград",
    "Кам'янське",
    "Житомир",
    "Бердичів",
    "Коростень",
    "Новоград-Волинський",
    "Ужгород",
    "Мукачево",
    "Берегове",
    "Хуст",
    "Запоріжжя",
    "Мелітополь",
    "Бердянськ",
    "Івано-Франківськ",
    "Калуш",
    "Коломия",
    "Бурштин",
    "Біла Церква",
    "Бровари",
    "Бориспіль",
    "Фастів",
    "Кропивницький",
    "Олександрія",
    "Світловодськ",
    "Знам'янка",
    "Львів",
    "Дрогобич",
    "Червоноград",
    "Стрий",
    "Миколаїв",
    "Вознесенськ",
    "Первомайськ",
    "Южноукраїнськ",
    "Одеса",
    "Ізмаїл",
    "Білгород-Дністровський",
    "Подільськ",
    "Полтава",
    "Кременчук",
    "Миргород",
    "Лубни",
    "Рівне",
    "Дубно",
    "Кузнецовськ",
    "Острог",
    "Суми",
    "Конотоп",
    "Шостка",
    "Охтирка",
    "Тернопіль",
    "Чортків",
    "Кременець",
    "Бережани",
    "Харків",
    "Лозова",
    "Ізюм",
    "Куп'янськ",
    "Херсон",
    "Нова Каховка",
    "Каховка",
    "Гола Пристань",
    "Хмельницький",
    "Кам'янець-Подільський",
    "Шепетівка",
    "Старокостянтинів",
    "Черкаси",
    "Умань",
    "Сміла",
    "Золотоноша",
    "Чернівці",
    "Новодністровськ",
    "Хотин",
    "Чернігів",
    "Ніжин",
    "Прилуки",
    "Новгород-Сіверський",
  ]

  const phrases = Array(5).fill("Доставляємо шини")

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex flex-wrap content-start opacity-10 select-none pointer-events-none">
        {phrases.map((phrase, index) => (
          <motion.div
            key={`phrase-${index}`}
            className="text-4xl md:text-5xl font-bold text-white/30 whitespace-nowrap m-4"
            initial={{ x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 }}
            animate={{
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 30 + Math.random() * 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "linear",
            }}
          >
            {phrase}
          </motion.div>
        ))}

        {cities.map((city, index) => (
          <motion.div
            key={`city-${index}`}
            className="text-sm md:text-base text-white/20 whitespace-nowrap m-2"
            initial={{ x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 }}
            animate={{
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "linear",
            }}
          >
            {city}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
