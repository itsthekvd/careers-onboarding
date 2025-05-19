"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { updateUserStepAction } from "./update-step-actions"
import { ExternalLink, Smartphone, Bell, Bookmark } from "lucide-react"

export function Step3Form({ submissionId, token }: { submissionId: string; token: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Checkboxes for confirming tool setup
  const [ticktickSetup, setTicktickSetup] = useState(false)
  const [zohoCliqSetup, setZohoCliqSetup] = useState(false)
  const [mobileAppsSetup, setMobileAppsSetup] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [bookmarksAdded, setBookmarksAdded] = useState(false)
  const [allToolsConfirmed, setAllToolsConfirmed] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (
      !ticktickSetup ||
      !zohoCliqSetup ||
      !mobileAppsSetup ||
      !notificationsEnabled ||
      !bookmarksAdded ||
      !allToolsConfirmed
    ) {
      setError("Please confirm that you've completed all the required steps")
      setIsSubmitting(false)
      return
    }

    try {
      // Store the data in the database
      const formData = new FormData()
      formData.append("ticktickSetup", ticktickSetup.toString())
      formData.append("zohoCliqSetup", zohoCliqSetup.toString())
      formData.append("mobileAppsSetup", mobileAppsSetup.toString())
      formData.append("notificationsEnabled", notificationsEnabled.toString())
      formData.append("bookmarksAdded", bookmarksAdded.toString())
      formData.append("allToolsConfirmed", allToolsConfirmed.toString())

      // Update the user's step
      const result = await updateUserStepAction(submissionId, token, 3)

      if (result.success) {
        router.push(`/onboarding/${submissionId}/step/4?token=${token}`)
      } else {
        setError(result.error || "Something went wrong. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-card rounded-lg shadow-xl p-6 sm:p-8 animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Maitreya Labs</h2>
        <p className="text-muted-foreground">Step 03: Setting Up Your Tools</p>
      </div>

      <div className="space-y-6">
        <p className="text-lg font-medium">You'll need to set up the following tools for your work:</p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 my-6">
          <p className="font-medium mb-2">Important:</p>
          <p>
            Use your <span className="font-semibold">given email address</span> (yourfirstname@itskaivalya.com) to login
            for all tools.
          </p>
        </div>

        <div className="space-y-6">
          {/* Zoho Cliq Setup */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">1. Zoho Cliq</h3>
                <p className="mb-3">
                  Zoho Cliq is our team communication tool. You'll use it to chat with team members and receive updates.
                </p>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800 mb-4">
                  <p className="font-medium">Important:</p>
                  <p>
                    You have already received access to Zoho Cliq. Please check your email and login with the
                    credentials provided.
                  </p>
                </div>

                <h4 className="font-medium mt-4 mb-2">Web Setup:</h4>
                <ol className="list-decimal pl-5 space-y-2 mb-4">
                  <li>
                    Go to{" "}
                    <a
                      href="https://cliq.zoho.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      cliq.zoho.in <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                  <li>Log in with your email (yourfirstname@itskaivalya.com)</li>
                  <li>Use the password format: Yourfirstname.Yourlastname@A123 (with first letters capitalized)</li>
                </ol>

                <div className="flex items-center mt-4 mb-3">
                  <Bookmark className="h-4 w-4 mr-2 text-blue-600" />
                  <h4 className="font-medium">Bookmark the URL:</h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 mb-4">
                  <li>
                    After logging in, bookmark{" "}
                    <a
                      href="https://cliq.zoho.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      cliq.zoho.in <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                  <li>
                    Press <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+D</span>{" "}
                    (Windows/Linux) or{" "}
                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">Cmd+D</span> (Mac) to add to
                    bookmarks
                  </li>
                  <li>Save it to your bookmark bar for easy access</li>
                </ol>

                <div className="flex items-center mt-4 mb-3">
                  <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
                  <h4 className="font-medium">Mobile App Setup:</h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 mb-4">
                  <li>
                    Download the Zoho Cliq app from the{" "}
                    <a
                      href="https://apps.apple.com/us/app/zoho-cliq/id1210799736"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      App Store
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://play.google.com/store/apps/details?id=com.zoho.chat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Google Play Store
                    </a>
                  </li>
                  <li>Log in with your email address (yourfirstname@itskaivalya.com)</li>
                  <li>Place the app on your home screen for easy access</li>
                </ol>

                <div className="flex items-center mt-4 mb-3">
                  <Bell className="h-4 w-4 mr-2 text-blue-600" />
                  <h4 className="font-medium">Enable Notifications:</h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 mb-4">
                  <li>In the Zoho Cliq app, go to Settings</li>
                  <li>Navigate to Notifications</li>
                  <li>Enable all notification types (Messages, Mentions, etc.)</li>
                  <li>Allow notifications in your device settings if prompted</li>
                </ol>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="zoho-cliq-setup"
                    checked={zohoCliqSetup}
                    onCheckedChange={(checked) => setZohoCliqSetup(checked === true)}
                  />
                  <Label htmlFor="zoho-cliq-setup" className="text-sm font-medium">
                    I have logged into Zoho Cliq and set up my account
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* TickTick Setup */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">2. TickTick</h3>
                <p className="mb-3">
                  TickTick is our project management tool. You'll use it to track your tasks and projects.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
                  <p className="font-medium">Note:</p>
                  <p>
                    You have already received an invitation to join our TickTick workspace. Please check your email for
                    the invitation.
                  </p>
                </div>

                <h4 className="font-medium mt-4 mb-2">Web Setup:</h4>
                <ol className="list-decimal pl-5 space-y-2 mb-4">
                  <li>Check your email for the TickTick invitation</li>
                  <li>Click the invitation link and complete the access process</li>
                  <li>Use your email address (yourfirstname@itskaivalya.com) to login</li>
                </ol>

                <div className="flex items-center mt-4 mb-3">
                  <Bookmark className="h-4 w-4 mr-2 text-blue-600" />
                  <h4 className="font-medium">Bookmark the URL:</h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 mb-4">
                  <li>
                    After accessing TickTick, go to{" "}
                    <a
                      href="https://ticktick.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      TickTick.com <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                  <li>
                    Press <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+D</span>{" "}
                    (Windows/Linux) or{" "}
                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">Cmd+D</span> (Mac) to add to
                    bookmarks
                  </li>
                  <li>Save it to your bookmark bar for easy access</li>
                </ol>

                <div className="flex items-center mt-4 mb-3">
                  <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
                  <h4 className="font-medium">Mobile App Setup:</h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 mb-4">
                  <li>
                    Download the TickTick app from the{" "}
                    <a
                      href="https://apps.apple.com/us/app/ticktick-to-do-list-calendar/id626144601"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      App Store
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://play.google.com/store/apps/details?id=com.ticktick.task"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Google Play Store
                    </a>
                  </li>
                  <li>Log in with your email address (yourfirstname@itskaivalya.com)</li>
                  <li>Place the app on your home screen for easy access</li>
                </ol>

                <div className="flex items-center mt-4 mb-3">
                  <Bell className="h-4 w-4 mr-2 text-blue-600" />
                  <h4 className="font-medium">Enable Notifications:</h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 mb-4">
                  <li>In the TickTick app, go to Settings</li>
                  <li>Navigate to Notifications</li>
                  <li>Enable all notification types (Tasks, Reminders, etc.)</li>
                  <li>Allow notifications in your device settings if prompted</li>
                </ol>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="ticktick-setup"
                    checked={ticktickSetup}
                    onCheckedChange={(checked) => setTicktickSetup(checked === true)}
                  />
                  <Label htmlFor="ticktick-setup" className="text-sm font-medium">
                    I have accepted the TickTick invitation and accessed my account
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 my-6">
          <p className="font-medium mb-2">Additional Setup Confirmation:</p>
          <div className="space-y-3 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mobile-apps-setup"
                checked={mobileAppsSetup}
                onCheckedChange={(checked) => setMobileAppsSetup(checked === true)}
              />
              <Label htmlFor="mobile-apps-setup" className="text-sm font-medium">
                I have downloaded and installed both mobile apps on my phone
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifications-enabled"
                checked={notificationsEnabled}
                onCheckedChange={(checked) => setNotificationsEnabled(checked === true)}
              />
              <Label htmlFor="notifications-enabled" className="text-sm font-medium">
                I have enabled notifications for both apps
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="bookmarks-added"
                checked={bookmarksAdded}
                onCheckedChange={(checked) => setBookmarksAdded(checked === true)}
              />
              <Label htmlFor="bookmarks-added" className="text-sm font-medium">
                I have bookmarked both websites in my browser
              </Label>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 my-6">
          <p className="mb-2">After setting up these tools:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You have already been added to specific projects and channels</li>
            <li>Your team and colleagues will reach out to you via Zoho Cliq</li>
            <li>Check your email regularly for additional instructions</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-tools-confirmed"
              checked={allToolsConfirmed}
              onCheckedChange={(checked) => setAllToolsConfirmed(checked === true)}
            />
            <Label htmlFor="all-tools-confirmed" className="text-sm font-medium">
              I confirm that I have completed all the steps above and set up all required tools
            </Label>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-center">
            <Button type="submit" className="px-8" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Proceed"}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-8">Copyright 2025, Maitreya Labs</div>
      </div>
    </div>
  )
}
