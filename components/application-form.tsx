"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { submitUrl } from "@/app/actions/submit-url"
import { ArrowRight, Check } from "lucide-react"

export function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [profileUrl, setProfileUrl] = useState("")

  return (
    <section className="py-16 bg-black text-white" id="url-submission">
      <div className="mobile-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Apply Now</h2>
          <p className="mt-4 text-gray-300">
            Take the first step towards transforming your career in digital marketing
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
                    Your Profile URL
                  </label>
                  <Input
                    id="profileUrl"
                    name="profileUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    required
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
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
                      Submit Application <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <p className="text-sm text-gray-400">
                  Share your LinkedIn profile or portfolio website to start the application process.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
