"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import Link from "next/link"

export default function Gallery() {

  const [planets, setPlanets] = useState<any[]>([])

  useEffect(() => {
    fetchPlanets()
  }, [])

  const fetchPlanets = async () => {

    const { data } = await supabase
      .from("planets")
      .select("*")
      .order("created_at", { ascending: false })

    setPlanets(data || [])
  }

  return (

    <div className="min-h-screen bg-[#0b132b] text-white p-10">

      <h1 className="text-3xl mb-8">Planet Gallery</h1>

      <Link href="/" className="border px-4 py-2 rounded">
        Back to Galaxy
      </Link>

      <div className="grid grid-cols-6 gap-6 mt-8">

        {planets.map((planet) => (

          <div key={planet.id} className="text-center">

            <img
              src={planet.image_url}
              className="w-24 h-24 object-contain mx-auto"
            />

            <p className="mt-2 text-sm">{planet.name || "Unnamed Planet"}</p>

          </div>

        ))}

      </div>

    </div>
  )
}