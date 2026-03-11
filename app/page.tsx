"use client"

import { useState, useEffect } from "react"
import DrawPlanetModal from "../components/DrawPlanetModal"
import { supabase } from "../lib/supabase"
import Link from "next/link"

export default function Home() {

  const [open, setOpen] = useState(false)
  const [planets, setPlanets] = useState<any[]>([])
  const [star, setStar] = useState<any>(null)

  useEffect(() => {
    fetchPlanets()
  }, [])

  const fetchPlanets = async () => {

    const { data, error } = await supabase
      .from("planets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(11)

    if (!error && data) {
      setPlanets(data)
    }

  }

  // Shooting star system

  useEffect(() => {

    const spawnStar = () => {

      const startY = Math.random() * 40

      setStar({
        top: startY,
        id: Date.now()
      })

      setTimeout(() => setStar(null), 2000)

    }

    const interval = setInterval(spawnStar, 12000)

    return () => clearInterval(interval)

  }, [])


  return (

    <div className="min-h-screen text-white flex flex-col
    bg-[radial-gradient(circle_at_center,#1b2a49,#0b132b)]
    relative overflow-hidden">

      {/* Twinkling Stars */}

      <div className="absolute inset-0 pointer-events-none">

        {Array.from({ length: 80 }).map((_, i) => (

          <div
            key={i}
            className="absolute bg-white rounded-full opacity-70 animate-pulse"
            style={{
              width: "2px",
              height: "2px",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />

        ))}

      </div>


      {/* Title */}

      <div className="text-center pt-8 text-4xl font-semibold">
        The Secret Galaxy
      </div>


      {/* Galaxy Center */}

      <div className="flex flex-1 items-center justify-center">

        <div className="relative flex items-center justify-center w-[700px] h-[700px]">

          {/* Orbit Rings */}

          <div className="absolute w-[220px] h-[220px] border border-white/15 rounded-full scale-x-150"></div>

          <div className="absolute w-[340px] h-[340px] border border-white/10 rounded-full scale-x-150"></div>

          <div className="absolute w-[460px] h-[460px] border border-white/7 rounded-full scale-x-150"></div>

          <div className="absolute w-[580px] h-[580px] border border-white/5 rounded-full scale-x-150"></div>


          {/* Sun */}

          <div className="w-24 h-24 rounded-full bg-yellow-400 shadow-[0_0_60px_20px_rgba(255,200,0,0.6)]"></div>


          {/* Shooting Star */}

          {star && (

            <div
              key={star.id}
              className="shooting-star"
              style={{
                top: `${star.top}%`
              }}
            />

          )}


          {/* Planets */}

          {planets.map((planet, i) => {

            const rings = [220, 340, 460, 580]

            const ring = rings[i % rings.length]

            const speed = 30 + (i * 10)

            return (

              <div
                key={planet.id}
                className="absolute flex items-center justify-center"
                style={{
                  width: ring,
                  height: ring,
                  animation: `orbit ${speed}s linear infinite`
                }}
              >

                <img
                  src={planet.image_url}
                  className="absolute w-24 h-24 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  style={{
                    top: "-48px"
                  }}
                />

              </div>

            )

          })}

        </div>

      </div>


      {/* Bottom Buttons */}

      <div className="flex justify-center gap-6 pb-10">

        <button
          onClick={() => setOpen(true)}
          className="border px-6 py-2 rounded-lg hover:bg-white hover:text-black transition"
        >
          + Add Planet
        </button>

        <Link
          href="/gallery"
          className="border px-6 py-2 rounded-lg hover:bg-white hover:text-black transition"
        >
          See Planet Gallery
        </Link>

      </div>


      {/* Drawing Modal */}

      {open && <DrawPlanetModal close={() => setOpen(false)} />}

    </div>

  )

}