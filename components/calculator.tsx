"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Calculator() {
  const [calculatorRef, calculatorInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Variants for animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section ref={calculatorRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={calculatorInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-1.5 bg-purple-100 text-purple-800 rounded-full">Підбір</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Калькулятор підбору шин</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Оберіть параметри вашої техніки, і ми підберемо оптимальні шини CEAT для ваших потреб
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={calculatorInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-10">
              <Tabs defaultValue="tractor" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="tractor" className="text-base">
                    Трактор
                  </TabsTrigger>
                  <TabsTrigger value="sprayer" className="text-base">
                    Обприскувач
                  </TabsTrigger>
                  <TabsTrigger value="combine" className="text-base">
                    Комбайн
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tractor" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Бренд</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue="CEAT"
                      >
                        <option value="CEAT">CEAT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Розмір</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue=""
                      >
                        <option value="">Оберіть розмір</option>
                        <option value="480/70R38">480/70R38</option>
                        <option value="520/85R42">520/85R42</option>
                        <option value="380/85R24">380/85R24</option>
                        <option value="710/70R42">710/70R42</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Потужність, к.с.</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue=""
                      >
                        <option value="">Оберіть потужність</option>
                        <option value="80-150">80-150</option>
                        <option value="150-250">150-250</option>
                        <option value="250-350">250-350</option>
                        <option value="350+">350+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Умови</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue=""
                      >
                        <option value="">Оберіть умови</option>
                        <option value="seeding">Посів</option>
                        <option value="transport">Транспортування</option>
                        <option value="field">Польові роботи</option>
                        <option value="mixed">Змішані умови</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                      Підібрати шину
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="sprayer" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Бренд</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue="CEAT"
                      >
                        <option value="CEAT">CEAT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Розмір</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue=""
                      >
                        <option value="">Оберіть розмір</option>
                        <option value="380/90R46">380/90R46</option>
                        <option value="420/80R46">420/80R46</option>
                        <option value="520/85R38">520/85R38</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Об'єм бака, л</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue=""
                      >
                        <option value="">Оберіть об'єм</option>
                        <option value="2000-3000">2000-3000</option>
                        <option value="3000-4000">3000-4000</option>
                        <option value="4000+">4000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Тип ґрунту</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue=""
                      >
                        <option value="">Оберіть тип ґрунту</option>
                        <option value="light">Легкий</option>
                        <option value="medium">Середній</option>
                        <option value="heavy">Важкий</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                      Підібрати шину
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="combine" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Бренд</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue="CEAT"
                      >
                        <option value="CEAT">CEAT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Розмір</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue=""
                      >
                        <option value="">Оберіть розмір</option>
                        <option value="800/65R32">800/65R32</option>
                        <option value="900/60R32">900/60R32</option>
                        <option value="650/75R32">650/75R32</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Потужність, к.с.</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue=""
                      >
                        <option value="">Оберіть потужність</option>
                        <option value="250-350">250-350</option>
                        <option value="350-450">350-450</option>
                        <option value="450+">450+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Культура</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                        defaultValue=""
                      >
                        <option value="">Оберіть культуру</option>
                        <option value="wheat">Пшениця</option>
                        <option value="corn">Кукурудза</option>
                        <option value="sunflower">Соняшник</option>
                        <option value="mixed">Змішані культури</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                      Підібрати шину
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-10 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Рекомендовані шини</h3>
                <p className="text-center text-gray-500">Оберіть параметри для отримання рекомендацій</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
