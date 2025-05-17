"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Software Engineer",
    company: "Tech Solutions Inc.",
    quote:
      "The personalized guidance I received helped me land my dream job at a top tech company. The step-by-step process was exactly what I needed.",
    image: "/placeholder.svg?key=w3pds",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "UX Designer",
    company: "Creative Designs",
    quote:
      "I was stuck in my career until I found this program. The industry insights and networking opportunities completely transformed my professional trajectory.",
    image: "/female-ux-designer-headshot.png",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Data Scientist",
    company: "Data Insights",
    quote:
      "The structured approach to career development gave me clarity about my strengths and how to leverage them. I've since received two promotions!",
    image: "/placeholder.svg?key=vpsz2",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Product Manager",
    company: "Innovation Labs",
    quote:
      "As someone transitioning careers, I needed guidance that was both practical and encouraging. This program delivered exactly that and more.",
    image: "/placeholder.svg?key=9o1yz",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
]

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const isMobile = useMobile()
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      if (!isPlaying) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, isPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
    setAutoplay(false)
    setIsPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    setAutoplay(false)
    setIsPlaying(false)
  }

  const handlePlayVideo = () => {
    setIsPlaying(true)
    setAutoplay(false)
  }

  return (
    <section className="mobile-section bg-background" id="testimonials">
      <div className="mobile-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Success Stories</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from students who transformed their careers with our guidance
          </p>
        </div>

        <div className="mx-auto max-w-4xl" ref={sliderRef}>
          <div className="relative">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black shadow-xl">
              {!isPlaying ? (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    backgroundImage: `url('${testimonials[currentIndex].image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                  <Button
                    size="icon"
                    className="relative z-10 h-16 w-16 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300"
                    onClick={handlePlayVideo}
                  >
                    <Play className="h-8 w-8 fill-current" />
                    <span className="sr-only">Play video</span>
                  </Button>

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <blockquote className="mb-4 text-lg italic">"{testimonials[currentIndex].quote}"</blockquote>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xl font-bold">{testimonials[currentIndex].name}</p>
                        <p className="text-sm text-gray-300">
                          {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={testimonials[currentIndex].video}
                  title={`Testimonial by ${testimonials[currentIndex].name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {/* Navigation arrows */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 md:left-0 md:-translate-x-full md:pl-8">
              <Button
                variant="contrast"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/90 text-black shadow-md hover:bg-white"
                onClick={goToPrevious}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 md:right-0 md:translate-x-full md:pr-8">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={goToNext}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Dots navigation */}
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary" : "bg-primary/20"
                }`}
                onClick={() => {
                  setCurrentIndex(index)
                  setAutoplay(false)
                  setIsPlaying(false)
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
