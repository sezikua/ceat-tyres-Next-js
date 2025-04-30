"use client"

import { useCallback } from "react"
import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"
import type { Engine } from "tsparticles-engine"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <html lang="uk">
      <body className="relative min-h-screen flex flex-col items-center justify-center">
        {/* Фон з частинками */}
        <div className="fixed inset-0 z-0">
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              background: {
                color: {
                  value: "#0d1117",
                },
              },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "push",
                  },
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 100,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: ["#3498db", "#2ecc71", "#1abc9c"],
                },
                links: {
                  color: "#ffffff",
                  distance: 150,
                  enable: true,
                  opacity: 0.3,
                  width: 1,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 1,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 5 },
                },
              },
              detectRetina: true,
            }}
          />
        </div>

        {/* Контент */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-8xl font-bold text-white mb-6">Помилка</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Щось пішло не так</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Спробувати знову
            </button>
            <a
              href="http://zoryev.top/"
              className="bg-transparent border-2 border-white text-white px-8 py-4 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              На головну
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
