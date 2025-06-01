"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ExternalLink, BellRing, Smartphone } from "lucide-react"
import { updateUserStepAction } from "./update-step-actions"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function Step5Form({ submissionId, token }: { submissionId: string; token: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [roadmapVideosWatched, setRoadmapVideosWatched] = useState(false)
  const [threeThingsWatched, setThreeThingsWatched] = useState(false)
  const [v0PromptEngineeringWatched, setV0PromptEngineeringWatched] = useState(false)
  const [notionTutorialsWatched, setNotionTutorialsWatched] = useState(false)
  const [basecampWatched, setBasecampWatched] = useState(false)
  const [crmTutorialsWatched, setCrmTutorialsWatched] = useState(false)
  const [googleSpaceWatched, setGoogleSpaceWatched] = useState(false)
  const [nextStepsRead, setNextStepsRead] = useState(false)
  const [appsNotificationsAgreed, setAppsNotificationsAgreed] = useState(false)
  const [questions, setQuestions] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (
      !roadmapVideosWatched ||
      !threeThingsWatched ||
      !v0PromptEngineeringWatched ||
      !notionTutorialsWatched ||
      !basecampWatched ||
      !crmTutorialsWatched ||
      !googleSpaceWatched ||
      !nextStepsRead ||
      !appsNotificationsAgreed
    ) {
      setError(
        "Please confirm that you have watched all the videos, read the next steps, and agree to install the apps with notifications enabled",
      )
      setIsSubmitting(false)
      return
    }

    try {
      // Store the data in the database
      const formData = new FormData()
      formData.append("roadmapVideosWatched", roadmapVideosWatched.toString())
      formData.append("threeThingsWatched", threeThingsWatched.toString())
      formData.append("v0PromptEngineeringWatched", v0PromptEngineeringWatched.toString())
      formData.append("notionTutorialsWatched", notionTutorialsWatched.toString())
      formData.append("basecampWatched", basecampWatched.toString())
      formData.append("crmTutorialsWatched", crmTutorialsWatched.toString())
      formData.append("googleSpaceWatched", googleSpaceWatched.toString())
      formData.append("nextStepsRead", nextStepsRead.toString())
      formData.append("appsNotificationsAgreed", appsNotificationsAgreed.toString())
      formData.append("questions", questions)

      // Submit the form data to the server
      const result = await fetch(`/onboarding/${submissionId}/step/5/api`, {
        method: "POST",
        body: formData,
        headers: {
          "x-onboarding-token": token,
        },
      }).then((res) => res.json())

      if (result.success) {
        // Update the user's step
        const stepResult = await updateUserStepAction(submissionId, token, 5)

        if (stepResult.success) {
          router.push(`/onboarding/${submissionId}/complete?token=${token}`)
        } else {
          setError(stepResult.error || "Something went wrong. Please try again.")
        }
      } else {
        setError(result.error || "Failed to submit your feedback. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl bg-card rounded-lg shadow-xl animate-slide-up">
      <div className="text-center p-6 border-b">
        <h2 className="text-2xl font-bold">Maitreya Labs</h2>
        <p className="text-muted-foreground">Step 05: Your Roadmap</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="p-6">
        <div className="space-y-8">
          {/* Introduction Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-2">Welcome to Your Roadmap</h3>
            <p className="text-sm">
              This is the final step of your onboarding process. Please watch all the videos to understand our tools,
              processes, and what to expect next. The TickTick video is especially important as this is the tool you'll
              be using daily.
            </p>
          </div>

          {/* Primary Tool: TickTick */}
          <div className="border rounded-lg overflow-hidden bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-transparent">
            <div className="bg-blue-100 dark:bg-blue-800/30 p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs mr-2">PRIMARY TOOL</span>
                TickTick - Our Project Management Tool
              </h3>
              <p className="text-sm text-muted-foreground">This is the main tool you'll be using at Maitreya Labs</p>
            </div>

            <div className="p-4">
              <div className="aspect-video w-full max-w-2xl mx-auto">
                <iframe
                  src="https://www.youtube.com/embed/eIw6hH43Psc"
                  title="TickTick Quick Walkthrough"
                  className="w-full h-full rounded-md"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          {/* Additional Videos Section */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
              <h3 className="text-lg font-semibold">Additional Training Videos</h3>
              <p className="text-sm text-muted-foreground">
                These videos teach important concepts about problem-solving, first principles thinking, and our work
                philosophy
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-4 text-sm">
                <p>
                  <strong>Note:</strong> While we may not use all these specific tools in your role, the core
                  principles, problem-solving approaches, and workflows demonstrated apply to our current systems. Focus
                  on understanding the underlying concepts.
                </p>
              </div>

              {/* Roadmap Videos */}
              <div className="border-b pb-4">
                <h4 className="font-medium mb-2">Roadmap Videos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="aspect-video w-full">
                    <iframe
                      src="https://www.youtube.com/embed/1bWAfgElne8"
                      title="Roadmap"
                      className="w-full h-full rounded-md"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <Checkbox
                    id="roadmap-videos"
                    checked={roadmapVideosWatched}
                    onCheckedChange={(checked) => setRoadmapVideosWatched(checked === true)}
                    className="mr-2 h-4 w-4"
                  />
                  <Label htmlFor="roadmap-videos" className="text-sm">
                    I've watched the Roadmap videos
                  </Label>
                </div>
              </div>

              {/* Collapsible Sections for Additional Videos */}
              <details className="group" open>
                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-muted/50 px-4 py-2 text-sm font-medium">
                  <span>Three Things</span>
                  <svg
                    className="h-5 w-5 transition duration-300 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 px-4">
                  <div className="aspect-video w-full max-w-2xl mx-auto">
                    <iframe
                      src="https://www.youtube.com/embed/C8W0jJWS43w"
                      title="Three Things"
                      className="w-full h-full rounded-md"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Checkbox
                      id="three-things"
                      checked={threeThingsWatched}
                      onCheckedChange={(checked) => setThreeThingsWatched(checked === true)}
                      className="mr-2 h-4 w-4"
                    />
                    <Label htmlFor="three-things" className="text-sm">
                      I've watched the Three Things video
                    </Label>
                  </div>
                </div>
              </details>

              <details className="group" open>
                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-muted/50 px-4 py-2 text-sm font-medium">
                  <span>Problem Solving in V0, Prompt Engineering, Frontend & Backend</span>
                  <svg
                    className="h-5 w-5 transition duration-300 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 px-4">
                  <div className="aspect-video w-full max-w-2xl mx-auto">
                    <iframe
                      src="https://www.youtube.com/embed/qC2_wDdiIgI"
                      title="Intern Onboarding: Problem Solving in V0, Prompt Engineering, Frontend & Backend"
                      className="w-full h-full rounded-md"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Checkbox
                      id="v0-prompt-engineering"
                      checked={v0PromptEngineeringWatched}
                      onCheckedChange={(checked) => setV0PromptEngineeringWatched(checked === true)}
                      className="mr-2 h-4 w-4"
                    />
                    <Label htmlFor="v0-prompt-engineering" className="text-sm">
                      I've watched the Problem Solving in V0 video
                    </Label>
                  </div>
                </div>
              </details>

              <details className="group" open>
                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-muted/50 px-4 py-2 text-sm font-medium">
                  <span>Notion (For Reference)</span>
                  <svg
                    className="h-5 w-5 transition duration-300 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="aspect-video w-full">
                      <iframe
                        src="https://www.youtube.com/embed/nN1ZpFGMwtU"
                        title="Notion 1"
                        className="w-full h-full rounded-md"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="aspect-video w-full">
                      <iframe
                        src="https://www.youtube.com/embed/0d7nUfRw1MI"
                        title="Notion 2"
                        className="w-full h-full rounded-md"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="aspect-video w-full">
                      <iframe
                        src="https://www.youtube.com/embed/D10lFJ2nE5g"
                        title="Notion 3"
                        className="w-full h-full rounded-md"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="aspect-video w-full">
                      <iframe
                        src="https://www.youtube.com/embed/7FWBHsFL268"
                        title="Notion 4"
                        className="w-full h-full rounded-md"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Checkbox
                      id="notion-tutorials"
                      checked={notionTutorialsWatched}
                      onCheckedChange={(checked) => setNotionTutorialsWatched(checked === true)}
                      className="mr-2 h-4 w-4"
                    />
                    <Label htmlFor="notion-tutorials" className="text-sm">
                      I've watched the Notion tutorial videos
                    </Label>
                  </div>
                </div>
              </details>

              <details className="group" open>
                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-muted/50 px-4 py-2 text-sm font-medium">
                  <span>Basecamp (For Reference)</span>
                  <svg
                    className="h-5 w-5 transition duration-300 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 px-4">
                  <div className="aspect-video w-full max-w-2xl mx-auto">
                    <iframe
                      src="https://www.youtube.com/embed/MLyAb-LvQ1Y"
                      title="Basecamp"
                      className="w-full h-full rounded-md"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Checkbox
                      id="basecamp"
                      checked={basecampWatched}
                      onCheckedChange={(checked) => setBasecampWatched(checked === true)}
                      className="mr-2 h-4 w-4"
                    />
                    <Label htmlFor="basecamp" className="text-sm">
                      I've watched the Basecamp video
                    </Label>
                  </div>
                </div>
              </details>

              <details className="group" open>
                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-muted/50 px-4 py-2 text-sm font-medium">
                  <span>CRM (For Reference)</span>
                  <svg
                    className="h-5 w-5 transition duration-300 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="aspect-video w-full">
                      <iframe
                        src="https://www.youtube.com/embed/XZNamCg93Co"
                        title="CRM 1"
                        className="w-full h-full rounded-md"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="aspect-video w-full">
                      <iframe
                        src="https://www.youtube.com/embed/FQA1njR3T_U"
                        title="CRM 2"
                        className="w-full h-full rounded-md"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Checkbox
                      id="crm-tutorials"
                      checked={crmTutorialsWatched}
                      onCheckedChange={(checked) => setCrmTutorialsWatched(checked === true)}
                      className="mr-2 h-4 w-4"
                    />
                    <Label htmlFor="crm-tutorials" className="text-sm">
                      I've watched the CRM tutorial videos
                    </Label>
                  </div>
                </div>
              </details>

              <details className="group" open>
                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-muted/50 px-4 py-2 text-sm font-medium">
                  <span>Google Space (For Reference)</span>
                  <svg
                    className="h-5 w-5 transition duration-300 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="aspect-video w-full">
                      <iframe
                        src="https://www.youtube.com/embed/VhbWaJQy5zM"
                        title="Google Space 1"
                        className="w-full h-full rounded-md"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="aspect-video w-full">
                      <iframe
                        src="https://www.youtube.com/embed/pMGp9I8Ov9g"
                        title="Google Space 2"
                        className="w-full h-full rounded-md"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Checkbox
                      id="google-space"
                      checked={googleSpaceWatched}
                      onCheckedChange={(checked) => setGoogleSpaceWatched(checked === true)}
                      className="mr-2 h-4 w-4"
                    />
                    <Label htmlFor="google-space" className="text-sm">
                      I've watched the Google Space videos
                    </Label>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Questions Section */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
              <h3 className="text-lg font-semibold">Questions & Feedback</h3>
            </div>
            <div className="p-4">
              <label htmlFor="questions" className="block text-sm font-medium mb-2">
                Do you have any questions or feedback?
              </label>
              <textarea
                id="questions"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                className="w-full h-24 p-2 border rounded-md"
                placeholder="Type your questions or feedback here..."
              ></textarea>
              <p className="mt-2 text-xs text-muted-foreground">
                Your questions and feedback will be reviewed by our team and visible in the admin dashboard.
              </p>
            </div>
          </div>

          {/* Please Note Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-bold mb-2">Please Note:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li className="text-sm">
                If you want to discontinue your position at Maitreya Labs, you will have to notify us 15 days in
                advance.
              </li>
              <li className="text-sm">Integrity breaches will lead to the termination of our relationship.</li>
            </ol>
          </div>

          {/* Important Apps & Notifications Section */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-600">
            <h3 className="text-base font-bold mb-2 flex items-center">
              <BellRing className="h-5 w-5 text-yellow-500 mr-2" />
              IMPORTANT: Install Apps & Enable Notifications
            </h3>
            <p className="text-sm mb-3">
              You <strong>must</strong> install both Zoho Cliq and TickTick mobile apps and enable all notifications to
              ensure you don't miss any important communications or tasks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <Smartphone className="h-4 w-4 mr-2 text-blue-500" />
                  Zoho Cliq
                </h4>
                <ol className="list-decimal pl-5 text-xs space-y-1">
                  <li>Install from App Store/Google Play</li>
                  <li>Login with yourfirstname@itskaivalya.com</li>
                  <li>Password: Yourfirstname.Yourlastname@A123</li>
                  <li>Go to Settings → Notifications</li>
                  <li>Enable ALL notification options</li>
                </ol>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <Smartphone className="h-4 w-4 mr-2 text-blue-500" />
                  TickTick
                </h4>
                <ol className="list-decimal pl-5 text-xs space-y-1">
                  <li>Check Zoho Mail for invitation</li>
                  <li>Install from App Store/Google Play</li>
                  <li>Login with credentials from email</li>
                  <li>Go to Settings → Notifications</li>
                  <li>Enable ALL notification options</li>
                </ol>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <Checkbox
                id="apps-notifications-agreed"
                checked={appsNotificationsAgreed}
                onCheckedChange={(checked) => setAppsNotificationsAgreed(checked === true)}
                className="h-5 w-5"
              />
              <Label htmlFor="apps-notifications-agreed" className="font-medium text-sm">
                I agree to install both apps and enable all notifications
              </Label>
            </div>
          </div>

          {/* Next Steps Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-base font-bold mb-2">Thank You! Here are the next steps:</h3>
            <p className="text-sm mb-2">
              After completing this onboarding, you'll need to log in to Zoho Cliq to communicate with the team.
            </p>
            <div className="text-sm mb-4">
              <strong>Zoho Cliq Login Details:</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>
                  Login URL:{" "}
                  <a
                    href="https://cliq.zoho.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://cliq.zoho.in/
                  </a>
                </li>
                <li>Login ID: yourfirstname@itskaivalya.com</li>
                <li>
                  Password: <span className="font-medium">Y</span>ourfirstname.<span className="font-medium">Y</span>
                  ourlastname@A123{" "}
                  <span className="text-xs italic">
                    (First letter of both first name and last name should be capitalized)
                  </span>
                </li>
              </ul>
            </div>
            <p className="text-sm">
              You have already received your TickTick access invitation in your Zoho Mail inbox at{" "}
              <a
                href="https://mail.zoho.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                mail.zoho.in
              </a>
              . Please check your inbox and accept the invitation.
            </p>
          </div>

          <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-lg">Completion Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${roadmapVideosWatched ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {roadmapVideosWatched ? "✓" : ""}
                </div>
                <span className="text-sm">Roadmap Videos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${threeThingsWatched ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {threeThingsWatched ? "✓" : ""}
                </div>
                <span className="text-sm">Three Things</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${v0PromptEngineeringWatched ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {v0PromptEngineeringWatched ? "✓" : ""}
                </div>
                <span className="text-sm">Problem Solving in V0</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${notionTutorialsWatched ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {notionTutorialsWatched ? "✓" : ""}
                </div>
                <span className="text-sm">Notion Tutorials</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${basecampWatched ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {basecampWatched ? "✓" : ""}
                </div>
                <span className="text-sm">Basecamp</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${crmTutorialsWatched ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {crmTutorialsWatched ? "✓" : ""}
                </div>
                <span className="text-sm">CRM Tutorials</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${googleSpaceWatched ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {googleSpaceWatched ? "✓" : ""}
                </div>
                <span className="text-sm">Google Space</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${appsNotificationsAgreed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {appsNotificationsAgreed ? "✓" : ""}
                </div>
                <span className="text-sm">Install Apps & Enable Notifications</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4 pt-4 border-t">
              <Checkbox
                id="next-steps-read"
                checked={nextStepsRead}
                onCheckedChange={(checked) => setNextStepsRead(checked === true)}
                className="h-5 w-5"
              />
              <Label htmlFor="next-steps-read" className="font-medium text-base">
                I understand the next steps
              </Label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          <div className="flex justify-center">
            <a
              href="https://cliq.zoho.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              onClick={async (e) => {
                e.preventDefault()

                if (
                  !roadmapVideosWatched ||
                  !threeThingsWatched ||
                  !v0PromptEngineeringWatched ||
                  !notionTutorialsWatched ||
                  !basecampWatched ||
                  !crmTutorialsWatched ||
                  !googleSpaceWatched ||
                  !nextStepsRead ||
                  !appsNotificationsAgreed
                ) {
                  setError(
                    "Please confirm that you have watched all the videos, read the next steps, and agree to install the apps with notifications enabled",
                  )
                  return
                }

                setIsSubmitting(true)
                setError("")

                try {
                  // Store the data in the database
                  const formData = new FormData()
                  formData.append("roadmapVideosWatched", roadmapVideosWatched.toString())
                  formData.append("threeThingsWatched", threeThingsWatched.toString())
                  formData.append("v0PromptEngineeringWatched", v0PromptEngineeringWatched.toString())
                  formData.append("notionTutorialsWatched", notionTutorialsWatched.toString())
                  formData.append("basecampWatched", basecampWatched.toString())
                  formData.append("crmTutorialsWatched", crmTutorialsWatched.toString())
                  formData.append("googleSpaceWatched", googleSpaceWatched.toString())
                  formData.append("nextStepsRead", nextStepsRead.toString())
                  formData.append("appsNotificationsAgreed", appsNotificationsAgreed.toString())
                  formData.append("questions", questions)

                  // Submit the form data to the server
                  const result = await fetch(`/onboarding/${submissionId}/step/5/api`, {
                    method: "POST",
                    body: formData,
                    headers: {
                      "x-onboarding-token": token,
                    },
                  }).then((res) => res.json())

                  if (result.success) {
                    // Update the user's step
                    const stepResult = await updateUserStepAction(submissionId, token, 5)

                    if (stepResult.success) {
                      // Open Zoho Cliq in a new tab
                      window.open("https://cliq.zoho.in/", "_blank")
                      // Redirect to the completion page
                      router.push(`/onboarding/${submissionId}/complete?token=${token}`)
                    } else {
                      setError(stepResult.error || "Something went wrong. Please try again.")
                    }
                  } else {
                    setError(result.error || "Failed to submit your feedback. Please try again.")
                  }
                } catch (err) {
                  console.error("Error submitting form:", err)
                  setError("An unexpected error occurred. Please try again.")
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              {isSubmitting ? "Processing..." : "Complete Onboarding & Access Zoho Cliq"}{" "}
              {!isSubmitting && <ExternalLink className="ml-2 h-4 w-4" />}
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}
