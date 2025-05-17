"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoHero() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      <div className="mobile-container relative z-10 mobile-section flex flex-col items-center justify-center text-center">
        <div className="animate-slide-up space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Accelerate Your{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Career</span>
              <span className="absolute bottom-2 left-0 z-0 h-3 w-full bg-primary/20"></span>
            </span>{" "}
            Growth
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300 sm:text-xl">
            Join thousands of students who transformed their careers with our personalized guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 hover:text-black"
            >
              <a href="#contact">Get Started</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black"
            >
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>

        <div className="mt-12 w-full max-w-4xl">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-2xl">
            {!isPlaying ? (
              <div
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-black to-gray-900"
                style={{
                  backgroundImage: `url('/placeholder.svg?key=q3ihn')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Button
                  size="icon"
                  className="h-16 w-16 rounded-full bg-white text-black hover:bg-gray-200 hover:text-black hover:scale-105 transition-all duration-300"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="h-8 w-8 fill-current" />
                  <span className="sr-only">Play video</span>
                </Button>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                  <p className="text-xl font-bold">Watch Our Success Story</p>
                  <p className="text-sm text-gray-300">2:45 min</p>
                </div>
              </div>
            ) : (
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Career Accelerator Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
