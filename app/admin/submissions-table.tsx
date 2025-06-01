"use client"

import { useState } from "react"
import { createOnboardingLink, disableSubmission, enableSubmission } from "./actions"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, ExternalLink, LinkIcon, FileText, ChevronDown, ChevronRight, Eye } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Submission = {
  id: string
  profile_url: string
  status: string
  created_at: string
  onboarding_token?: string
  disabled?: boolean
  name?: string
  email?: string
  whatsapp?: string
  current_step?: number
  onboardingData?: any[]
}

export function SubmissionsTable({ submissions = [] }: { submissions: Submission[] }) {
  const [linkStates, setLinkStates] = useState<Record<string, { loading: boolean; link?: string }>>({})
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const isMobile = useMobile()
  const [disableStates, setDisableStates] = useState<Record<string, { loading: boolean }>>({})

  async function handleCreateLink(submissionId: string) {
    setLinkStates((prev) => ({
      ...prev,
      [submissionId]: { loading: true },
    }))

    try {
      const result = await createOnboardingLink(submissionId)

      if (result.success) {
        setLinkStates((prev) => ({
          ...prev,
          [submissionId]: { loading: false, link: result.onboardingLink },
        }))
      } else {
        setLinkStates((prev) => ({
          ...prev,
          [submissionId]: { loading: false },
        }))
        alert(result.error || "Failed to create link")
      }
    } catch (error) {
      setLinkStates((prev) => ({
        ...prev,
        [submissionId]: { loading: false },
      }))
      alert("An unexpected error occurred")
    }
  }

  async function handleDisableSubmission(submissionId: string) {
    setDisableStates((prev) => ({
      ...prev,
      [submissionId]: { loading: true },
    }))

    try {
      const result = await disableSubmission(submissionId)

      if (result.success) {
        alert("Submission disabled successfully")
      } else {
        alert(result.error || "Failed to disable submission")
      }
    } catch (error) {
      alert("An unexpected error occurred")
    } finally {
      setDisableStates((prev) => ({
        ...prev,
        [submissionId]: { loading: false },
      }))
    }
  }

  async function handleEnableSubmission(submissionId: string) {
    setDisableStates((prev) => ({
      ...prev,
      [submissionId]: { loading: true },
    }))

    try {
      const result = await enableSubmission(submissionId)

      if (result.success) {
        alert("Submission enabled successfully")
      } else {
        alert(result.error || "Failed to enable submission")
      }
    } catch (error) {
      alert("An unexpected error occurred")
    } finally {
      setDisableStates((prev) => ({
        ...prev,
        [submissionId]: { loading: false },
      }))
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(window.location.origin + text)
    alert("Link copied to clipboard")
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString()
  }

  function getStatusBadge(status: string, disabled?: boolean) {
    if (disabled) {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
        >
          Disabled
        </Badge>
      )
    }

    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
          >
            Pending
          </Badge>
        )
      case "onboarding":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
          >
            Onboarding
          </Badge>
        )
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
          >
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Check if a submission already has a token
  function hasToken(submission: Submission) {
    return submission.onboarding_token && submission.onboarding_token.length > 0
  }

  // Get the existing link for a submission with a token
  function getExistingLink(submission: Submission) {
    if (hasToken(submission)) {
      return `/onboarding/${submission.id}?token=${submission.onboarding_token}`
    }
    return null
  }

  // Check if submission has agreement data
  function hasAgreementData(submission: Submission) {
    return submission.onboardingData && submission.onboardingData.length > 0
  }

  // Toggle expanded row
  function toggleRowExpansion(submissionId: string) {
    setExpandedRows((prev) => ({
      ...prev,
      [submissionId]: !prev[submissionId],
    }))
  }

  // Render detailed submission data
  function renderSubmissionDetails(submission: Submission) {
    if (!submission.onboardingData || submission.onboardingData.length === 0) {
      return (
        <div className="py-4 text-center text-muted-foreground">No onboarding data available for this submission.</div>
      )
    }

    // Get step data
    const agreementData = submission.onboardingData.find((data) => data.step === 1)
    const personalData = submission.onboardingData.find((data) => data.step === 2)
    const workspaceData = submission.onboardingData.find((data) => data.step === 3)
    const valuesData = submission.onboardingData.find((data) => data.step === 4)
    const roadmapData = submission.onboardingData.find((data) => data.step === 5)

    return (
      <div className="py-4">
        <Tabs defaultValue="step1" className="w-full">
          <TabsList className="mb-4 w-full justify-start overflow-x-auto">
            <TabsTrigger value="step1" className={!agreementData ? "opacity-50" : ""}>
              Step 1: Agreement
            </TabsTrigger>
            <TabsTrigger value="step2" className={!personalData ? "opacity-50" : ""}>
              Step 2: Personal Info
            </TabsTrigger>
            <TabsTrigger value="step3" className={!workspaceData ? "opacity-50" : ""}>
              Step 3: Workspace
            </TabsTrigger>
            <TabsTrigger value="step4" className={!valuesData ? "opacity-50" : ""}>
              Step 4: Values
            </TabsTrigger>
            <TabsTrigger value="step5" className={!roadmapData ? "opacity-50" : ""}>
              Step 5: Roadmap
            </TabsTrigger>
          </TabsList>

          {/* Step 1: Agreement */}
          <TabsContent value="step1">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Agreement</CardTitle>
                <CardDescription>Internship agreement acceptance</CardDescription>
              </CardHeader>
              <CardContent>
                {agreementData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                        <p className="text-base">{agreementData.name || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p className="text-base">{agreementData.email || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">WhatsApp</h3>
                        <p className="text-base">{agreementData.whatsapp || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Submitted At</h3>
                        <p className="text-base">
                          {agreementData.submittedAt ? formatDate(agreementData.submittedAt) : "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Main Agreement</h3>
                        <p className="text-base">
                          {agreementData.agreementConsent === "true" ? "Accepted ✓" : "Not Accepted ✗"}
                        </p>
                      </div>

                      {agreementData.signature && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Signature</h3>
                          <div className="mt-1 border p-2 bg-white max-w-xs">
                            <img
                              src={agreementData.signature || "/placeholder.svg"}
                              alt="Signature"
                              className="max-h-[100px]"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Confidential Information Agreement
                        </h3>
                        <p className="text-base">
                          {agreementData.attachmentConsent === "true" ? "Accepted ✓" : "Not Accepted ✗"}
                        </p>
                      </div>

                      {agreementData.attachmentSignature && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Attachment Signature</h3>
                          <div className="mt-1 border p-2 bg-white max-w-xs">
                            <img
                              src={agreementData.attachmentSignature || "/placeholder.svg"}
                              alt="Attachment Signature"
                              className="max-h-[100px]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No agreement data submitted yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Personal Information */}
          <TabsContent value="step2">
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Personal Information</CardTitle>
                <CardDescription>Personal details and documents</CardDescription>
              </CardHeader>
              <CardContent>
                {personalData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                        <p className="text-base">{personalData.name || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p className="text-base">{personalData.email || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">WhatsApp</h3>
                        <p className="text-base">{personalData.whatsapp || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
                        <p className="text-base">{personalData.position || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Birthday</h3>
                        <p className="text-base">
                          {personalData.birthday
                            ? new Date(personalData.birthday).toLocaleDateString()
                            : "Not provided"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Submitted At</h3>
                        <p className="text-base">
                          {personalData.submittedAt ? formatDate(personalData.submittedAt) : "Unknown"}
                        </p>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="documents">
                        <AccordionTrigger>Document Uploads</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">PAN Card Front</h3>
                              {personalData.panFrontUrl ? (
                                <a
                                  href={personalData.panFrontUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-600 hover:underline mt-1"
                                >
                                  View Document <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <p className="text-muted-foreground">Not uploaded</p>
                              )}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">PAN Card Back</h3>
                              {personalData.panBackUrl ? (
                                <a
                                  href={personalData.panBackUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-600 hover:underline mt-1"
                                >
                                  View Document <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <p className="text-muted-foreground">Not uploaded</p>
                              )}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Adhaar Card Front</h3>
                              {personalData.aadharFrontUrl ? (
                                <a
                                  href={personalData.aadharFrontUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-600 hover:underline mt-1"
                                >
                                  View Document <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <p className="text-muted-foreground">Not uploaded</p>
                              )}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Adhaar Card Back</h3>
                              {personalData.aadharBackUrl ? (
                                <a
                                  href={personalData.aadharBackUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-600 hover:underline mt-1"
                                >
                                  View Document <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <p className="text-muted-foreground">Not uploaded</p>
                              )}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="introduction">
                        <AccordionTrigger>Introduction</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {personalData.introduction && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Introduction</h3>
                                <p className="text-base whitespace-pre-line">{personalData.introduction}</p>
                              </div>
                            )}
                            {personalData.quirk && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Quirk or Detail</h3>
                                <p className="text-base whitespace-pre-line">{personalData.quirk}</p>
                              </div>
                            )}
                            {personalData.hobbies && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Hobbies</h3>
                                <p className="text-base whitespace-pre-line">{personalData.hobbies}</p>
                              </div>
                            )}
                            {personalData.favoriteFood && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Favorite Food</h3>
                                <p className="text-base whitespace-pre-line">{personalData.favoriteFood}</p>
                              </div>
                            )}
                            {personalData.persona && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Persona in One Adjective</h3>
                                <p className="text-base">{personalData.persona}</p>
                              </div>
                            )}
                            {personalData.favoriteBook && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Favorite Book or Movie</h3>
                                <p className="text-base whitespace-pre-line">{personalData.favoriteBook}</p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="learning">
                        <AccordionTrigger>Learning & System</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {personalData.systemSpecs && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">System Specifications</h3>
                                <p className="text-base whitespace-pre-line">{personalData.systemSpecs}</p>
                              </div>
                            )}
                            {personalData.learningGoal && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Learning Goals</h3>
                                <p className="text-base whitespace-pre-line">{personalData.learningGoal}</p>
                              </div>
                            )}
                            {personalData.futureSkillset && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Future Skillset</h3>
                                <p className="text-base whitespace-pre-line">{personalData.futureSkillset}</p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="social">
                        <AccordionTrigger>Social Media</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {personalData.facebook && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Facebook</h3>
                                <a
                                  href={personalData.facebook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {personalData.facebook}
                                </a>
                              </div>
                            )}
                            {personalData.instagram && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Instagram</h3>
                                <a
                                  href={personalData.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {personalData.instagram}
                                </a>
                              </div>
                            )}
                            {personalData.linkedin && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">LinkedIn</h3>
                                <a
                                  href={personalData.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {personalData.linkedin}
                                </a>
                              </div>
                            )}
                            {personalData.twitter && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Twitter</h3>
                                <a
                                  href={personalData.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {personalData.twitter}
                                </a>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="internship">
                        <AccordionTrigger>Internship Details</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {personalData.bankDetails && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Bank Information</h3>
                                <pre className="bg-secondary p-4 rounded-md whitespace-pre-line text-sm">
                                  {personalData.bankDetails}
                                </pre>
                              </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {personalData.startTime && (
                                <div>
                                  <h3 className="text-sm font-medium text-muted-foreground">Preferred Start Time</h3>
                                  <p className="text-base">{personalData.startTime}</p>
                                </div>
                              )}
                              {personalData.lunchPreference && (
                                <div>
                                  <h3 className="text-sm font-medium text-muted-foreground">Lunch Break Preference</h3>
                                  <p className="text-base">
                                    {personalData.lunchPreference === "30min"
                                      ? "30 minutes"
                                      : personalData.lunchPreference === "45min"
                                        ? "45 minutes"
                                        : "60 minutes"}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No personal information submitted yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Workspace */}
          <TabsContent value="step3">
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Workspace Access</CardTitle>
                <CardDescription>Google Workspace information</CardDescription>
              </CardHeader>
              <CardContent>
                {workspaceData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Gmail Address</h3>
                        <p className="text-base">{workspaceData.gmailAddress || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Gmail Confirmation</h3>
                        <p className="text-base">
                          {workspaceData.confirmGmail === "true" ? "Confirmed ✓" : "Not Confirmed ✗"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Google Drive Access</h3>
                        <p className="text-base">
                          {workspaceData.confirmAccess === "true" ? "Confirmed ✓" : "Not Confirmed ✗"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Google Calendar Access</h3>
                        <p className="text-base">
                          {workspaceData.confirmCalendar === "true" ? "Confirmed ✓" : "Not Confirmed ✗"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Submitted At</h3>
                        <p className="text-base">
                          {workspaceData.submittedAt ? formatDate(workspaceData.submittedAt) : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No workspace data submitted yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Values */}
          <TabsContent value="step4">
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Values and Preferences</CardTitle>
                <CardDescription>Work style and communication preferences</CardDescription>
              </CardHeader>
              <CardContent>
                {valuesData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Core Value</h3>
                        <p className="text-base capitalize">{valuesData.coreValue || "Not selected"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Work Style</h3>
                        <p className="text-base capitalize">{valuesData.workStyle || "Not selected"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Communication Preference</h3>
                        <p className="text-base capitalize">{valuesData.communicationPreference || "Not selected"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Feedback Style</h3>
                        <p className="text-base capitalize">{valuesData.feedbackStyle || "Not selected"}</p>
                      </div>
                    </div>

                    {valuesData.selfDiscovery && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Self Discovery</h3>
                        <p className="text-base whitespace-pre-line">{valuesData.selfDiscovery}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Submitted At</h3>
                      <p className="text-base">
                        {valuesData.submittedAt ? formatDate(valuesData.submittedAt) : "Unknown"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No values data submitted yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 5: Roadmap */}
          <TabsContent value="step5">
            <Card>
              <CardHeader>
                <CardTitle>Step 5: Roadmap Completion</CardTitle>
                <CardDescription>Final onboarding steps</CardDescription>
              </CardHeader>
              <CardContent>
                {roadmapData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Videos Watched</h3>
                        <p className="text-base">
                          {roadmapData.videosWatched === "true" ? "Completed ✓" : "Not Completed ✗"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Next Steps Read</h3>
                        <p className="text-base">
                          {roadmapData.nextStepsRead === "true" ? "Completed ✓" : "Not Completed ✗"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Submitted At</h3>
                        <p className="text-base">
                          {roadmapData.submittedAt ? formatDate(roadmapData.submittedAt) : "Unknown"}
                        </p>
                      </div>
                    </div>

                    {roadmapData.questions && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Questions</h3>
                        <p className="text-base whitespace-pre-line">{roadmapData.questions}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No roadmap data submitted yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Mobile view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {!submissions || submissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No submissions yet</div>
        ) : (
          submissions.map((submission) => {
            const existingLink = getExistingLink(submission)
            const isExpanded = expandedRows[submission.id] || false

            return (
              <div key={submission.id} className="border rounded-lg overflow-hidden">
                <div
                  className="p-4 space-y-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => toggleRowExpansion(submission.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium truncate max-w-[200px]">
                        <a
                          href={submission.profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {submission.profile_url.replace(/^https?:\/\//, "")}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="text-sm text-muted-foreground">{formatDate(submission.created_at)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(submission.status, submission.disabled)}
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>

                  {submission.name && (
                    <div className="pt-2 border-t">
                      <div className="font-medium">{submission.name}</div>
                      {submission.email && <div className="text-sm text-muted-foreground">{submission.email}</div>}
                      {submission.whatsapp && (
                        <div className="text-sm text-muted-foreground">{submission.whatsapp}</div>
                      )}
                    </div>
                  )}

                  {submission.current_step && (
                    <div className="pt-2 border-t">
                      <div className="text-sm mb-1">Progress: Step {submission.current_step} of 5</div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(submission.current_step / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div className="border-t">
                    {renderSubmissionDetails(submission)}

                    <div className="p-4 border-t flex flex-wrap gap-2">
                      {hasAgreementData(submission) && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/${submission.id}`} onClick={(e) => e.stopPropagation()}>
                            <FileText className="h-3 w-3 mr-1" />
                            View Details
                          </Link>
                        </Button>
                      )}

                      {existingLink || linkStates[submission.id]?.link ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(existingLink || linkStates[submission.id].link!)
                          }}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Link
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCreateLink(submission.id)
                          }}
                          disabled={linkStates[submission.id]?.loading}
                        >
                          <LinkIcon className="h-3 w-3 mr-1" />
                          {linkStates[submission.id]?.loading ? "Creating..." : "Create Link"}
                        </Button>
                      )}

                      {submission.disabled ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEnableSubmission(submission.id)
                          }}
                          disabled={disableStates[submission.id]?.loading}
                          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        >
                          {disableStates[submission.id]?.loading ? "Enabling..." : "Enable"}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDisableSubmission(submission.id)
                          }}
                          disabled={disableStates[submission.id]?.loading}
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        >
                          {disableStates[submission.id]?.loading ? "Disabling..." : "Disable"}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    )
  }

  // Desktop view
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Profile URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>User Details</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!submissions || submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No submissions yet
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission) => {
              const existingLink = getExistingLink(submission)
              const isExpanded = expandedRows[submission.id] || false

              return (
                <>
                  <TableRow key={submission.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="w-10" onClick={() => toggleRowExpansion(submission.id)}>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="whitespace-nowrap" onClick={() => toggleRowExpansion(submission.id)}>
                      {formatDate(submission.created_at)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" onClick={() => toggleRowExpansion(submission.id)}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={submission.profile_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {submission.profile_url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{submission.profile_url}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell onClick={() => toggleRowExpansion(submission.id)}>
                      {getStatusBadge(submission.status, submission.disabled)}
                    </TableCell>
                    <TableCell onClick={() => toggleRowExpansion(submission.id)}>
                      {submission.name ? (
                        <div className="space-y-1">
                          <p className="font-medium">{submission.name}</p>
                          {submission.email && <p className="text-sm text-muted-foreground">{submission.email}</p>}
                          {submission.whatsapp && (
                            <p className="text-sm text-muted-foreground">{submission.whatsapp}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not started</span>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleRowExpansion(submission.id)}>
                      {submission.current_step ? (
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${(submission.current_step / 5) * 100}%` }}
                          ></div>
                          <p className="text-xs mt-1">Step {submission.current_step} of 5</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not started</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => toggleRowExpansion(submission.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {isExpanded ? "Hide Details" : "View Details"}
                        </Button>

                        {hasAgreementData(submission) && (
                          <Button asChild variant="outline" size="sm" className="h-8">
                            <Link href={`/admin/${submission.id}`}>
                              <FileText className="h-3 w-3 mr-1" />
                              Full View
                            </Link>
                          </Button>
                        )}

                        {existingLink || linkStates[submission.id]?.link ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => copyToClipboard(existingLink || linkStates[submission.id].link!)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Link
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleCreateLink(submission.id)}
                            disabled={linkStates[submission.id]?.loading}
                          >
                            <LinkIcon className="h-3 w-3 mr-1" />
                            {linkStates[submission.id]?.loading ? "Creating..." : "Create Link"}
                          </Button>
                        )}

                        {submission.disabled ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            onClick={() => handleEnableSubmission(submission.id)}
                            disabled={disableStates[submission.id]?.loading}
                          >
                            {disableStates[submission.id]?.loading ? "Enabling..." : "Enable"}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            onClick={() => handleDisableSubmission(submission.id)}
                            disabled={disableStates[submission.id]?.loading}
                          >
                            {disableStates[submission.id]?.loading ? "Disabling..." : "Disable"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0 border-t-0">
                        <div className="border-t">{renderSubmissionDetails(submission)}</div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
