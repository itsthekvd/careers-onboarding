import { getOnboardingData } from "../actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function SubmissionDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  const onboardingData = await getOnboardingData(id)

  // Get step data
  const agreementData = onboardingData.find((data) => data.step === 1)
  const personalData = onboardingData.find((data) => data.step === 2)
  const workspaceData = onboardingData.find((data) => data.step === 3)
  const valuesData = onboardingData.find((data) => data.step === 4)
  const roadmapData = onboardingData.find((data) => data.step === 5)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Submission Details</h1>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="agreement">Agreement</TabsTrigger>
          {personalData && <TabsTrigger value="documents">Documents</TabsTrigger>}
          {personalData && <TabsTrigger value="introduction">Introduction</TabsTrigger>}
          {personalData && <TabsTrigger value="internship">Internship Details</TabsTrigger>}
          {workspaceData && <TabsTrigger value="workspace">Workspace</TabsTrigger>}
          {valuesData && <TabsTrigger value="values">Values</TabsTrigger>}
          {roadmapData && <TabsTrigger value="roadmap">Roadmap</TabsTrigger>}
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic details provided by the applicant</CardDescription>
            </CardHeader>
            <CardContent>
              {personalData ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                    <dd className="text-lg">{personalData.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Email Address</dt>
                    <dd className="text-lg">{personalData.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">WhatsApp Number</dt>
                    <dd className="text-lg">{personalData.whatsapp}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Position</dt>
                    <dd className="text-lg">{personalData.position}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Birthday</dt>
                    <dd className="text-lg">{new Date(personalData.birthday).toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Submitted At</dt>
                    <dd className="text-lg">{new Date(personalData.submittedAt).toLocaleString()}</dd>
                  </div>
                </dl>
              ) : agreementData ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                    <dd className="text-lg">{agreementData.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Email Address</dt>
                    <dd className="text-lg">{agreementData.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">WhatsApp Number</dt>
                    <dd className="text-lg">{agreementData.whatsapp}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Submitted At</dt>
                    <dd className="text-lg">{new Date(agreementData.submittedAt).toLocaleString()}</dd>
                  </div>
                </dl>
              ) : (
                <p className="text-muted-foreground">No personal information found for this submission.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agreement">
          {agreementData ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agreement Consent</CardTitle>
                  <CardDescription>Internship agreement acceptance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Main Agreement</h3>
                      <p className="text-muted-foreground mb-2">
                        Consent: {agreementData.agreementConsent === "true" ? "Accepted" : "Not Accepted"}
                      </p>
                      {agreementData.signature && (
                        <div>
                          <p className="text-sm font-medium mb-1">Signature:</p>
                          <div className="border p-2 bg-white">
                            <img
                              src={agreementData.signature || "/placeholder.svg"}
                              alt="Signature"
                              className="max-h-[150px]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Confidential Information Agreement</h3>
                      <p className="text-muted-foreground mb-2">
                        Consent: {agreementData.attachmentConsent === "true" ? "Accepted" : "Not Accepted"}
                      </p>
                      {agreementData.attachmentSignature && (
                        <div>
                          <p className="text-sm font-medium mb-1">Signature:</p>
                          <div className="border p-2 bg-white">
                            <img
                              src={agreementData.attachmentSignature || "/placeholder.svg"}
                              alt="Attachment Signature"
                              className="max-h-[150px]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No agreement data found for this submission.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {personalData && (
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Uploads</CardTitle>
                <CardDescription>Identity documents provided by the applicant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">PAN Card Front</h3>
                    {personalData.panFrontPreview ? (
                      <div className="border p-2 bg-white">
                        <img
                          src={personalData.panFrontPreview || "/placeholder.svg"}
                          alt="PAN Card Front"
                          className="max-h-[200px] mx-auto"
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No image uploaded</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">PAN Card Back</h3>
                    {personalData.panBackPreview ? (
                      <div className="border p-2 bg-white">
                        <img
                          src={personalData.panBackPreview || "/placeholder.svg"}
                          alt="PAN Card Back"
                          className="max-h-[200px] mx-auto"
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No image uploaded</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Aadhaar Card Front</h3>
                    {personalData.aadharFrontPreview ? (
                      <div className="border p-2 bg-white">
                        <img
                          src={personalData.aadharFrontPreview || "/placeholder.svg"}
                          alt="Aadhaar Card Front"
                          className="max-h-[200px] mx-auto"
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No image uploaded</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Aadhaar Card Back</h3>
                    {personalData.aadharBackPreview ? (
                      <div className="border p-2 bg-white">
                        <img
                          src={personalData.aadharBackPreview || "/placeholder.svg"}
                          alt="Aadhaar Card Back"
                          className="max-h-[200px] mx-auto"
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No image uploaded</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {personalData && (
          <TabsContent value="introduction">
            <Card>
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
                <CardDescription>Personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {personalData.introduction && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Introduction</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{personalData.introduction}</p>
                    </div>
                  )}

                  {personalData.quirk && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Quirk or Detail</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{personalData.quirk}</p>
                    </div>
                  )}

                  {personalData.hobbies && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Hobbies</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{personalData.hobbies}</p>
                    </div>
                  )}

                  {personalData.favoriteFood && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Favorite Food</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{personalData.favoriteFood}</p>
                    </div>
                  )}

                  {personalData.persona && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Persona in One Adjective</h3>
                      <p className="text-muted-foreground">{personalData.persona}</p>
                    </div>
                  )}

                  {personalData.favoriteBook && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Favorite Book or Movie</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{personalData.favoriteBook}</p>
                    </div>
                  )}

                  {personalData.systemSpecs && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">System Specifications</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{personalData.systemSpecs}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium mb-2">Learning Goals</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{personalData.learningGoal}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Future Skillset</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{personalData.futureSkillset}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Social Media</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {personalData.facebook && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Facebook</dt>
                          <dd>
                            <a
                              href={personalData.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {personalData.facebook}
                            </a>
                          </dd>
                        </div>
                      )}

                      {personalData.instagram && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Instagram</dt>
                          <dd>
                            <a
                              href={personalData.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {personalData.instagram}
                            </a>
                          </dd>
                        </div>
                      )}

                      {personalData.linkedin && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">LinkedIn</dt>
                          <dd>
                            <a
                              href={personalData.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {personalData.linkedin}
                            </a>
                          </dd>
                        </div>
                      )}

                      {personalData.twitter && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Twitter</dt>
                          <dd>
                            <a
                              href={personalData.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {personalData.twitter}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {personalData && (
          <TabsContent value="internship">
            <Card>
              <CardHeader>
                <CardTitle>Internship Details</CardTitle>
                <CardDescription>Work preferences and bank information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Bank Information</h3>
                    <pre className="bg-secondary p-4 rounded-md whitespace-pre-line text-sm">
                      {personalData.bankDetails}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Preferred Start Time</h3>
                      <p className="text-muted-foreground">{personalData.startTime}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Lunch Break Preference</h3>
                      <p className="text-muted-foreground">
                        {personalData.lunchPreference === "30min"
                          ? "30 minutes"
                          : personalData.lunchPreference === "45min"
                            ? "45 minutes"
                            : "60 minutes"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {workspaceData && (
          <TabsContent value="workspace">
            <Card>
              <CardHeader>
                <CardTitle>Workspace Access</CardTitle>
                <CardDescription>Google Workspace information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Gmail Address</h3>
                    <p className="text-muted-foreground">{workspaceData.gmailAddress}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Gmail Confirmation</h3>
                      <p className="text-muted-foreground">
                        {workspaceData.confirmGmail === "true" ? "Confirmed" : "Not Confirmed"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Google Drive Access</h3>
                      <p className="text-muted-foreground">
                        {workspaceData.confirmAccess === "true" ? "Confirmed" : "Not Confirmed"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Google Calendar Access</h3>
                      <p className="text-muted-foreground">
                        {workspaceData.confirmCalendar === "true" ? "Confirmed" : "Not Confirmed"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Submitted At</h3>
                      <p className="text-muted-foreground">{new Date(workspaceData.submittedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {valuesData && (
          <TabsContent value="values">
            <Card>
              <CardHeader>
                <CardTitle>Values and Preferences</CardTitle>
                <CardDescription>Work style and communication preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Core Value</h3>
                    <p className="text-muted-foreground capitalize">{valuesData.coreValue}</p>
                  </div>

                  {valuesData.selfDiscovery && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Self Discovery</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{valuesData.selfDiscovery}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium mb-2">Work Style</h3>
                    <p className="text-muted-foreground capitalize">{valuesData.workStyle}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Communication Preference</h3>
                    <p className="text-muted-foreground capitalize">{valuesData.communicationPreference}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Feedback Style</h3>
                    <p className="text-muted-foreground capitalize">{valuesData.feedbackStyle}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Submitted At</h3>
                    <p className="text-muted-foreground">{new Date(valuesData.submittedAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {roadmapData && (
          <TabsContent value="roadmap">
            <Card>
              <CardHeader>
                <CardTitle>Roadmap Completion</CardTitle>
                <CardDescription>Final onboarding steps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Videos Watched</h3>
                      <p className="text-muted-foreground">
                        {roadmapData.videosWatched === "true" ? "Completed" : "Not Completed"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Next Steps Read</h3>
                      <p className="text-muted-foreground">
                        {roadmapData.nextStepsRead === "true" ? "Completed" : "Not Completed"}
                      </p>
                    </div>

                    {roadmapData.questions && (
                      <div className="col-span-2">
                        <h3 className="text-lg font-medium mb-2">Questions</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{roadmapData.questions}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-medium mb-2">Submitted At</h3>
                      <p className="text-muted-foreground">{new Date(roadmapData.submittedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button asChild>
          <Link href={`/admin/export/${id}`}>Export as PDF</Link>
        </Button>
      </div>
    </div>
  )
}
