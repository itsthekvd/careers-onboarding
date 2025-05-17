"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = "6ORK-CY9kdw"

  const scrollToForm = () => {
    const element = document.getElementById("url-submission")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative bg-white py-12 md:py-20">
      <div className="mobile-container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
              Now Accepting Applications
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Join the Elite Digital Marketing Team
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Where high-level problem solvers and critical thinkers are shaping the future of digital marketing through
              intense learning and first-principles thinking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button onClick={scrollToForm} className="bg-black text-white hover:bg-black/90 px-8 py-6 text-base">
                Apply Now
              </Button>
              {/* Learn More button removed as requested */}
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            {!isPlaying ? (
              <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  alt="Digital Marketing Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                    aria-label="Play video"
                  >
                    <Play className="h-8 w-8 fill-black text-black" />
                  </button>
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium">
                  Hi, I am KAIVALYA
                </div>
              </div>
            ) : (
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title="Maitreya Labs Introduction"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
