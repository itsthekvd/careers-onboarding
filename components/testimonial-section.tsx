"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Shubham",
    role: "Former Intern",
    views: "1.2K views",
    videoId: "N0uauK98OZI",
  },
  {
    id: 2,
    name: "Ayush",
    role: "Former Intern",
    views: "2 views",
    videoId: "cWPNPynXgUI",
  },
  {
    id: 3,
    name: "Viraj",
    role: "Former Intern",
    views: "4 views",
    videoId: "wAiehEJPUrU",
  },
  {
    id: 4,
    name: "Suganya",
    role: "Former Intern",
    views: "3 views",
    videoId: "HbZ3IRxErZo",
  },
]

export function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLIFrameElement>(null)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
    setIsPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    setIsPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsPlaying(false)
  }

  return (
    <section className="py-16 bg-white">
      <div className="mobile-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Hear From Our Interns</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Real stories from real people who have transformed their careers through our program
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            {!isPlaying ? (
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={`https://img.youtube.com/vi/${testimonials[currentIndex].videoId}/maxresdefault.jpg`}
                  alt={`${testimonials[currentIndex].name}'s testimonial`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                    aria-label="Play video"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{testimonials[currentIndex].name}</h3>
                  <p className="text-sm opacity-90">{testimonials[currentIndex].role}</p>
                </div>
                <div className="absolute bottom-4 right-4 text-white text-sm opacity-80">
                  {testimonials[currentIndex].views}
                </div>
              </div>
            ) : (
              <div className="aspect-video">
                <iframe
                  ref={videoRef}
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${testimonials[currentIndex].videoId}?autoplay=1`}
                  title={`${testimonials[currentIndex].name}'s Testimonial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="rounded-full"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex ? "bg-black w-8" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
