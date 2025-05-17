"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitOnboardingStep1 } from "./actions"
import { ArrowRight, User, Mail, Phone } from "lucide-react"

export function OnboardingForm({
  submissionId,
  token,
}: {
  submissionId: string
  token: string
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  })
  const [currentField, setCurrentField] = useState(0)
  const fields = ["name", "email", "whatsapp"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const goToNextField = () => {
    if (currentField < fields.length - 1) {
      setCurrentField(currentField + 1)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formDataObj = new FormData()
    formDataObj.append("name", formData.name)
    formDataObj.append("email", formData.email)
    formDataObj.append("whatsapp", formData.whatsapp)

    try {
      const result = await submitOnboardingStep1(submissionId, token, formDataObj)

      if (result.success && result.redirectUrl) {
        router.push(result.redirectUrl)
      } else {
        setError(result.error || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case "name":
        return <User className="h-5 w-5" />
      case "email":
        return <Mail className="h-5 w-5" />
      case "whatsapp":
        return <Phone className="h-5 w-5" />
      default:
        return null
    }
  }

  const getFieldLabel = (fieldName: string) => {
    switch (fieldName) {
      case "name":
        return "What's your name?"
      case "email":
        return "What's your email address?"
      case "whatsapp":
        return "What's your WhatsApp number?"
      default:
        return ""
    }
  }

  const getFieldPlaceholder = (fieldName: string) => {
    switch (fieldName) {
      case "name":
        return "Enter your full name"
      case "email":
        return "Enter your email address"
      case "whatsapp":
        return "Enter your WhatsApp number with country code"
      default:
        return ""
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 sm:p-8 animate-slide-up">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Let's Get Started</h2>
          <div className="text-sm text-muted-foreground">Step 1 of 5</div>
        </div>

        <div className="w-full bg-secondary h-2 rounded-full">
          <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field}
              className={`transition-all duration-500 ${
                index === currentField
                  ? "opacity-100 translate-y-0"
                  : index < currentField
                    ? "opacity-50 -translate-y-4"
                    : "opacity-0 translate-y-4 h-0 overflow-hidden"
              }`}
            >
              <Label htmlFor={field} className="text-lg font-medium flex items-center gap-2">
                {getFieldIcon(field)} {getFieldLabel(field)}
              </Label>
              <div className="mt-2">
                <Input
                  id={field}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder={getFieldPlaceholder(field)}
                  className="h-12"
                  type={field === "email" ? "email" : "text"}
                  required
                  autoFocus={index === currentField}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && index < fields.length - 1) {
                      e.preventDefault()
                      goToNextField()
                    }
                  }}
                />
              </div>
              {index < fields.length - 1 && index === currentField && (
                <Button
                  type="button"
                  className="mt-2"
                  onClick={goToNextField}
                  disabled={!formData[field as keyof typeof formData]}
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          type="submit"
          className="w-full h-12"
          disabled={isSubmitting || !formData.name || !formData.email || !formData.whatsapp}
        >
          {isSubmitting ? "Submitting..." : "Continue to Next Step"}
        </Button>
      </form>
    </div>
  )
}
