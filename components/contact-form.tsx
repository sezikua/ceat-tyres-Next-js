"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

export function ContactForm() {
  const [contactRef, contactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Variants for animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section ref={contactRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={contactInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-1.5 bg-orange-100 text-orange-800 rounded-full">Контакти</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Зв'яжіться з нами</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Маєте питання щодо шин CEAT? Заповніть форму, і наші спеціалісти зв'яжуться з вами найближчим часом
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={contactInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Наші контакти</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-orange-500" />
                      <a href="tel:+380501234567" className="hover:text-orange-500 transition-colors">
                        +38 (050) 424-95-10
                      </a>
                    </li>
                    <li className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-orange-500" />
                      <a href="mailto:s.kostrov@agrosolar.com.ua" className="hover:text-orange-500 transition-colors">
                        s.kostrov@agrosolar.com.ua
                      </a>
                    </li>
                    <li className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-orange-500 mt-1" />
                      <span>вул. Сулими, 11, смт. Глеваха, Фастівський район, Київська область, Україна, 08631</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mt-8 mb-4">Години роботи</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-orange-500" />
                      <span>Пн-Пт: 9:00 - 18:00</span>
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-orange-500" />
                      <span>Сб: 10:00 - 15:00</span>
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-orange-500" />
                      <span>Нд: Вихідний</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mt-8 mb-4">Соціальні мережі</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://facebook.com"
                      className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href="https://instagram.com"
                      className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-2 rounded-full hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href="https://t.me/ceatua"
                      className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 text-white transition-colors"
                      aria-label="Telegram"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.196-2.783 5.056-4.566c.223-.198-.054-.308-.335-.116l-6.24 3.93-2.69-.918c-.585-.177-.596-.585.124-.866l10.53-4.067c.48-.177.902.107.777.658z" />
                      </svg>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Ім'я
                        </label>
                        <Input id="name" placeholder="Ваше ім'я" className="w-full p-3 rounded-lg" required />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Телефон
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+380 XX XXX XX XX"
                          className="w-full p-3 rounded-lg"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="tire-type" className="block text-sm font-medium text-gray-700 mb-2">
                        Тип шини / розмір (опційно)
                      </label>
                      <Input id="tire-type" placeholder="Наприклад: 480/70R38" className="w-full p-3 rounded-lg" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Повідомлення
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Ваше повідомлення"
                        className="w-full p-3 min-h-[120px] rounded-lg"
                        required
                      />
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <Checkbox id="terms" required />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-700">
                          Я згоден з обробкою персональних даних
                        </label>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Надіслати запит
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-10 rounded-2xl overflow-hidden shadow-lg h-[400px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4318.988711249159!2d30.277159663332604!3d50.24163465158212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sru!2sua!4v1745391677292!5m2!1sru!2sua"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="absolute inset-0"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
