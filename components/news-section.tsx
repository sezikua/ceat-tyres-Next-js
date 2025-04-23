"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export function NewsSection() {
  const [newsRef, newsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Variants for animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section ref={newsRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={newsInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-1.5 bg-red-100 text-red-800 rounded-full">Актуальне</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Новини та акції</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Будьте в курсі останніх новин, акцій та спеціальних пропозицій від CEAT
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {[
              {
                title: "CEAT представив нову серію шин для тракторів",
                date: "15 квітня 2025",
                description: "Нова серія шин з покращеною зносостійкістю та зчепленням з ґрунтом.",
                image: "/ceat-tractor-tires-field.png",
                tag: "Новинка",
              },
              {
                title: "Весняна акція — знижки до 15%",
                date: "1 квітня 2025",
                description: "Встигніть придбати шини CEAT зі знижкою до 15% до кінця весни.",
                image: "/ceat-safety-drive.png",
                tag: "Акція",
              },
              {
                title: "Результати польових випробувань шин CEAT",
                date: "20 березня 2025",
                description: "Дослідження показали високу ефективність шин CEAT у різних умовах.",
                image: "/ceat-tractor-fieldwork.png",
                tag: "Дослідження",
              },
              {
                title: "Нове партнерство з John Deere",
                date: "10 березня 2025",
                description: "CEAT став офіційним постачальником шин для тракторів John Deere в Україні.",
                image: "/golden-wheat-harvest.png",
                tag: "Партнерство",
              },
            ].map((news, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-1">
                <Card className="overflow-hidden h-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={news.image || "/placeholder.svg"} alt={news.title} fill className="object-cover" />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`px-3 py-1 ${
                          news.tag === "Акція"
                            ? "bg-red-500"
                            : news.tag === "Новинка"
                              ? "bg-green-500"
                              : news.tag === "Партнерство"
                                ? "bg-blue-500"
                                : "bg-purple-500"
                        } text-white border-none`}
                      >
                        {news.tag}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 mb-2">{news.date}</p>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{news.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{news.description}</p>
                    <Link
                      href={`/news/${index + 1}`}
                      className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Читати далі
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="static transform-none mx-2" />
            <CarouselNext className="static transform-none mx-2" />
          </div>
        </Carousel>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 text-lg rounded-full transition-all duration-300"
          >
            Всі новини та акції
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
