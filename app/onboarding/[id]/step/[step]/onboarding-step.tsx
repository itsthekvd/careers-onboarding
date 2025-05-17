"use client"
import { StepForm } from "./step-form"

export function OnboardingStep({
  submissionId,
  token,
  step,
}: {
  submissionId: string
  token: string
  step: number
}) {
  // Get step titles
  const stepTitles = [
    "Internship Agreement",
    "Getting to Know You",
    "Accessing WorkSpace",
    "Values and Self-Discovery",
    "Roadmap",
  ]

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Career Accelerator</h1>
        <p className="text-muted-foreground">
          Step {step} of 5: {stepTitles[step - 1]}
        </p>
      </div>

      <div className="w-full bg-secondary h-2 rounded-full mb-8">
        <div className="bg-primary h-2 rounded-full" style={{ width: `${(step / 5) * 100}%` }}></div>
      </div>

      <StepForm submissionId={submissionId} token={token} stepNumber={step} title={stepTitles[step - 1]} />
    </div>
  )
}
