"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { submitUrl } from "@/app/actions/submit-url"
import { ArrowRight, Check } from "lucide-react"

export function UrlSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [profileUrl, setProfileUrl] = useState("")

  return (
    <section className="mobile-section bg-black text-white" id="contact">
      <div className="mobile-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Transform Your Career?</h2>
          <p className="mt-4 text-lg text-gray-300">
            Submit your LinkedIn profile or portfolio URL to get started on your personalized career journey
          </p>

          <div className="mt-10 rounded-xl bg-white/5 backdrop-blur-sm p-6 sm:p-8">
            {isSuccess ? (
              <div className="animate-slide-up space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Thank You!</h3>
                <p className="text-gray-300">
                  We've received your submission. Our team will review your profile and reach out with next steps.
                </p>
              </div>
            ) : (
              <form
                action={async (formData) => {
                  setIsSubmitting(true)
                  setError("")

                  try {
                    // Log the form data for debugging
                    const url = formData.get("profileUrl")
                    console.log("Submitting URL:", url)

                    // Call the server action to submit the URL
                    const result = await submitUrl(formData)
                    console.log("Submission result:", result)

                    if (result.success) {
                      setIsSuccess(true)
                    } else {
                      setError(result.error || "Something went wrong. Please try again.")
                    }
                  } catch (err) {
                    console.error("Form submission error:", err)
                    setError("An unexpected error occurred. Please try again.")
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label htmlFor="profileUrl" className="text-left block text-sm font-medium">
                    LinkedIn or Portfolio URL
                  </label>
                  <Input
                    id="profileUrl"
                    name="profileUrl"
                    type="url"
                    placeholder="Enter your LinkedIn or portfolio URL"
                    required
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  {error && <p className="text-red-400 text-sm text-left">{error}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-white text-black hover:bg-white/90 hover:text-black transition-all duration-300"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <p className="text-sm text-gray-400">
                  We'll review your profile and send you a personalized onboarding link.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
