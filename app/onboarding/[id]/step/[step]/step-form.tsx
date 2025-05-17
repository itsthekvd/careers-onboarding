"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, ExternalLink, Loader2, Link2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Import the server action wrapper
import { submitStepForm } from "./step-form-actions"

export function StepForm({
  submissionId,
  token,
  stepNumber,
  title,
}: {
  submissionId: string
  token: string
  stepNumber: number
  title: string
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Step 2 specific state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [position, setPosition] = useState("")
  const [birthday, setBirthday] = useState("")
  const [introduction, setIntroduction] = useState("")
  const [quirk, setQuirk] = useState("")
  const [hobbies, setHobbies] = useState("")
  const [favoriteFood, setFavoriteFood] = useState("")
  const [persona, setPersona] = useState("")
  const [favoriteBook, setFavoriteBook] = useState("")
  const [systemSpecs, setSystemSpecs] = useState("")
  const [learningGoal, setLearningGoal] = useState("")
  const [futureSkillset, setFutureSkillset] = useState("")
  const [facebook, setFacebook] = useState("")
  const [instagram, setInstagram] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [twitter, setTwitter] = useState("")
  const [bankDetails, setBankDetails] = useState("")
  const [startTime, setStartTime] = useState("")
  const [lunchPreference, setLunchPreference] = useState("")

  // Document URL states
  const [panFrontUrl, setPanFrontUrl] = useState("")
  const [panBackUrl, setPanBackUrl] = useState("")
  const [aadharFrontUrl, setAadharFrontUrl] = useState("")
  const [aadharBackUrl, setAadharBackUrl] = useState("")

  // Step 3 specific state
  const [workspaceSetupConfirmed, setWorkspaceSetupConfirmed] = useState(false)

  // Step 4 specific state
  const [valuesRead, setValuesRead] = useState(false)

  // Step 5 specific state
  const [videosWatched, setVideosWatched] = useState(false)
  const [nextStepsRead, setNextStepsRead] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const formData = new FormData()

      // Add step number to form data
      formData.append("step", stepNumber.toString())

      if (stepNumber === 2) {
        // Validate required fields
        if (
          !position ||
          !birthday ||
          !learningGoal ||
          !futureSkillset ||
          !bankDetails ||
          !startTime ||
          !lunchPreference
        ) {
          setError("Please fill in all required fields")
          setIsSubmitting(false)
          return
        }

        // Validate document URLs
        if (!panFrontUrl || !panBackUrl || !aadharFrontUrl || !aadharBackUrl) {
          setError("Please provide URLs for all required documents")
          setIsSubmitting(false)
          return
        }

        // Personal information (collected in step 1)
        // firstName, lastName, email, and whatsapp are now collected in step 1

        // Introduction fields
        formData.append("introduction", introduction)
        formData.append("quirk", quirk)
        formData.append("hobbies", hobbies)
        formData.append("favoriteFood", favoriteFood)
        formData.append("persona", persona)
        formData.append("favoriteBook", favoriteBook)
        formData.append("systemSpecs", systemSpecs)
        formData.append("learningGoal", learningGoal)
        formData.append("futureSkillset", futureSkillset)

        // Social media
        formData.append("facebook", facebook)
        formData.append("instagram", instagram)
        formData.append("linkedin", linkedin)
        formData.append("twitter", twitter)

        // Internship details
        formData.append("bankDetails", bankDetails)
        formData.append("startTime", startTime)
        formData.append("lunchPreference", lunchPreference)

        // Document URLs
        formData.append("panFrontUrl", panFrontUrl)
        formData.append("panBackUrl", panBackUrl)
        formData.append("aadharFrontUrl", aadharFrontUrl)
        formData.append("aadharBackUrl", aadharBackUrl)
      } else if (stepNumber === 3) {
        // Validate workspace setup confirmation
        if (!workspaceSetupConfirmed) {
          setError("Please confirm that you have set up your workspace")
          setIsSubmitting(false)
          return
        }

        formData.append("workspaceSetupConfirmed", workspaceSetupConfirmed.toString())
      } else if (stepNumber === 4) {
        // Validate values read confirmation
        if (!valuesRead) {
          setError("Please confirm that you have read and understood our values")
          setIsSubmitting(false)
          return
        }

        formData.append("valuesRead", valuesRead.toString())
      } else if (stepNumber === 5) {
        // Validate videos watched and next steps read
        if (!videosWatched || !nextStepsRead) {
          setError("Please confirm that you have watched the videos and read the next steps")
          setIsSubmitting(false)
          return
        }

        formData.append("videosWatched", videosWatched.toString())
        formData.append("nextStepsRead", nextStepsRead.toString())
      }

      console.log(`Submitting step ${stepNumber} form data...`)

      // Use the wrapper function
      const result = await submitStepForm(submissionId, token, stepNumber, formData)
      console.log("Form submission result:", result)

      if (result.success) {
        if (result.nextStep) {
          router.push(`/onboarding/${submissionId}/step/${result.nextStep}?token=${token}`)
        } else {
          // This was the last step
          router.push(`/onboarding/${submissionId}/complete?token=${token}`)
        }
      } else {
        setError(result.error || "Something went wrong. Please try again.")
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  function goBack() {
    if (stepNumber > 1) {
      router.push(`/onboarding/${submissionId}/step/${stepNumber - 1}?token=${token}`)
    } else {
      router.push(`/onboarding/${submissionId}?token=${token}`)
    }
  }

  // Render Step 2 form
  if (stepNumber === 2) {
    return (
      <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-xl p-6 sm:p-8 animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Maitreya Labs</h2>
          <p className="text-muted-foreground">Step 02: Getting to Know You</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
              <p className="text-sm">
                Your basic information (name, email, and WhatsApp) has already been collected in Step 1.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-base">
                Position at Maitreya Labs*
              </Label>
              <Select value={position} onValueChange={setPosition} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Digital Marketing Project Manager">Digital Marketing Project Manager</SelectItem>
                  <SelectItem value="Video Editor">Video Editor</SelectItem>
                  <SelectItem value="UI / UX Designer">UI / UX Designer</SelectItem>
                  <SelectItem value="Website Developer">Website Developer</SelectItem>
                  <SelectItem value="Copywriter">Copywriter</SelectItem>
                  <SelectItem value="Telecalling">Telecalling</SelectItem>
                  <SelectItem value="AI Manager">AI Manager</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday" className="text-base">
                When is your birthday?*
              </Label>
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-xl font-semibold">Document Uploads</h3>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6 border-l-4 border-blue-500">
              <p className="text-sm">
                Please upload your documents to Google Drive, Dropbox, or any other cloud storage service and provide
                the links below. Make sure the sharing permissions are set to "Anyone with the link can view".
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="panFrontUrl" className="text-base">
                  PAN Card Front URL*
                </Label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="panFrontUrl"
                      value={panFrontUrl}
                      onChange={(e) => setPanFrontUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Share a link to the front side of your PAN card</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="panBackUrl" className="text-base">
                  PAN Card Back URL*
                </Label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="panBackUrl"
                      value={panBackUrl}
                      onChange={(e) => setPanBackUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Share a link to the back side of your PAN card</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadharFrontUrl" className="text-base">
                  Adhaar Card Front URL*
                </Label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="aadharFrontUrl"
                      value={aadharFrontUrl}
                      onChange={(e) => setAadharFrontUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Share a link to the front side of your Adhaar card</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadharBackUrl" className="text-base">
                  Adhaar Card Back URL*
                </Label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="aadharBackUrl"
                      value={aadharBackUrl}
                      onChange={(e) => setAadharBackUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Share a link to the back side of your Adhaar card</p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-xl font-semibold">Introduction</h3>

            <div className="space-y-2">
              <Label htmlFor="introduction" className="text-base">
                Please introduce yourselves to your team members in a brief manner.
              </Label>
              <Textarea
                id="introduction"
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                placeholder="Write your introduction here..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quirk" className="text-base">
                A little known detail or quirk about you that you want to share with your team members.
              </Label>
              <Textarea
                id="quirk"
                value={quirk}
                onChange={(e) => setQuirk(e.target.value)}
                placeholder="Share something unique about yourself..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hobbies" className="text-base">
                What are your hobbies?
              </Label>
              <Textarea
                id="hobbies"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                placeholder="List your hobbies..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="favoriteFood" className="text-base">
                Favorite food? What's special about it?
              </Label>
              <Textarea
                id="favoriteFood"
                value={favoriteFood}
                onChange={(e) => setFavoriteFood(e.target.value)}
                placeholder="Tell us about your favorite food..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona" className="text-base">
                Please describe your persona in one adjective.
              </Label>
              <Input
                id="persona"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="One adjective that describes you..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="favoriteBook" className="text-base">
                What's your favorite book or a movie? And Why?
              </Label>
              <Textarea
                id="favoriteBook"
                value={favoriteBook}
                onChange={(e) => setFavoriteBook(e.target.value)}
                placeholder="Share your favorite book or movie and why you like it..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemSpecs" className="text-base">
                What are the specs of your system (Laptop and Smartphone) and why you have chosen these specs?
              </Label>
              <Textarea
                id="systemSpecs"
                value={systemSpecs}
                onChange={(e) => setSystemSpecs(e.target.value)}
                placeholder="Describe your laptop and smartphone specifications..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningGoal" className="text-base">
                What is the one thing you are looking to learn at Maitreya Labs*
              </Label>
              <Textarea
                id="learningGoal"
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                placeholder="Share what you want to learn during your time here..."
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="futureSkillset" className="text-base">
                What is the specific skillset you want to be known for after five years from now?*
              </Label>
              <Textarea
                id="futureSkillset"
                value={futureSkillset}
                onChange={(e) => setFutureSkillset(e.target.value)}
                placeholder="Describe your long-term skill development goals..."
                className="min-h-[80px]"
                required
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-xl font-semibold">Let's connect.</h3>

            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-base">
                Social Media: Facebook
              </Label>
              <Input
                id="facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="Your Facebook profile URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-base">
                Social Media: Instagram
              </Label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Your Instagram profile URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-base">
                Social Media: LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="Your LinkedIn profile URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-base">
                Social Media: Twitter
              </Label>
              <Input
                id="twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="Your Twitter profile URL"
              />
            </div>
          </div>

          {/* Internship Details */}
          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-xl font-semibold">Internship / Job details</h3>

            <div className="space-y-2">
              <Label htmlFor="bankDetails" className="text-base">
                Bank information for the stipend / salary [PLEASE CONFIRM THE DETAILS PROPERLY BEFORE SUBMITTING.]*
              </Label>
              <Textarea
                id="bankDetails"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                placeholder="Bank Acc. Holder's Name: 
Bank IFSC Code: 
Bank Acc. Number: 
SWIFT code: 
MICR Code: 
Account Type (Savings/Current):"
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-base">
                At what time would you like to start the day?*
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                An ordinary office day consists of 9 hrs of office work.
                <br />
                <br />
                We are flexible with schedules. You can work according to your time table. Please reciprocate this
                flexibility with superb accountability and response-ability.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lunchPreference" className="text-base">
                Please select your preference of lunch break.*
              </Label>
              <RadioGroup value={lunchPreference} onValueChange={setLunchPreference} required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30min" id="30min" />
                  <Label htmlFor="30min">30 minutes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="45min" id="45min" />
                  <Label htmlFor="45min">45 minutes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60min" id="60min" />
                  <Label htmlFor="60min">60 minutes</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit to proceed. <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  // The rest of the component remains the same...
  // Render Step 3 form - Accessing WorkSpace
  if (stepNumber === 3) {
    return (
      <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-xl p-6 sm:p-8 animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Maitreya Labs</h2>
          <p className="text-muted-foreground">Step 03: Accessing WorkSpace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-lg font-medium">We are using Gmail WorkSpace for professional collaboration.</p>
            <p>It looks like this: (yourname@maitreyalabs.com).</p>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md my-6">
              <p className="font-medium">Always use professional email for work purposes.</p>
              <p>You can go to Chrome and login with your professional Email ID.</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md my-6 border-l-4 border-blue-500">
              <p className="font-medium">Please sign in with your work email ID.</p>
              <p>Your Email ID would be yourname@maitreyalabs.com with the password Yourname.Surname@A123</p>
              <p>First letter of the name and surname will be capital in the password.</p>
              <p>You can go ahead and set this up before moving forward. And bookmark the following as well.</p>
              <ul className="list-disc list-inside mt-2">
                <li>Meetings will be visible on Calendar.Google.com.</li>
                <li>Check projects and libraries at TickTick.com with the above email address.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="workspace-setup"
              checked={workspaceSetupConfirmed}
              onCheckedChange={(checked) => setWorkspaceSetupConfirmed(checked === true)}
            />
            <Label htmlFor="workspace-setup" className="font-medium">
              I have set up my workspace email and bookmarked the required sites
            </Label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Proceed <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">Copyright 2025, Maitreya Labs</div>
        </form>
      </div>
    )
  }

  // Render Step 4 form - Values and Self-Discovery
  if (stepNumber === 4) {
    return (
      <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-xl p-6 sm:p-8 animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Maitreya Labs</h2>
          <p className="text-muted-foreground">Step 04: Values and Self-Discovery</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="prose prose-sm max-w-none dark:prose-invert overflow-y-auto max-h-[70vh]">
            <h3>Our Values</h3>
            <p>
              Below are our values, specific behaviours, and skills we care about the most. The more these sound like
              you and describe people you want to work with, the more likely you will thrive at Maitreya Labs
            </p>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">KINDNESS</h4>
              <p>
                We value caring for others. Helping others is a priority, even when it is not immediately related to the
                goals that you are trying to achieve. Similarly, you can rely on others for help and advice. In fact,
                you're expected to do so.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">AGGRESSIVE LEARNING</h4>
              <p>
                Our only strength and advantage over others at the moment is knowledge & skill, not money, not brand,
                not power, nothing else at all.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">TRANSPARENCY</h4>
              <p>
                Be open about as many things as possible. Directness is about being transparent with each other. Be
                straightforward and kind, an uncommon cocktail of no-bullshit and no-asshole. Remember: Feedback is
                always about your work and not you as a person.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">NO HIERARCHY</h4>
              <p>
                We are trying to create an atmosphere where anybody's opinion can be challenged. Any past decisions and
                guidelines are open to questioning as long as you act in accordance with them until they are changed.
                However, while a policy or decision is still in place we all agree to commit to it.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">TEAM-WORK</h4>
              <p>
                We are like a sports team. Like in Football - everyone runs hard to tackle opponents and in that course
                they fall, but eventually pass the ball to the striker and score the goal. In Cricket, the entire team
                is fielding and supporting with full energy while the bowler is in action. Well, our team is no less
                than these sports teams, we flourish as one.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">DIVERSITY</h4>
              <p>
                The team consists of people from different backgrounds and opinions. So, we work together to make
                everyone feel welcome and increase the participation of the team members.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">INTEGRITY</h4>
              <p>
                We operate with integrity and a sense of justice on both: The clients part and towards each other. With
                our clients, we try to do our best and produce world class results. OUR CLIENTS COME TO US BECAUSE THEY
                TRUST US, AND WE REPAY THAT TRUST WITH EXEMPLARY PERFORMANCE.
              </p>
              <p className="font-bold">WE'RE NOT VENDORS, WE'RE EXPERTS!</p>
              <p>
                This is one of the most important values we have. Integrity breaches, whether towards clients or towards
                each other are not allowed. We have a zero tolerance policy towards the same.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">SAY THANK YOU</h4>
              <p>
                Recognise the people that helped you publicly. Demonstrating we care for people provides an effective
                framework for direct challenges and feedbacks. Give as much positive feedback as you can, and do it in a
                public way. Give negative feedback in the smallest setting possible. Disclaimer: Feedback should be
                early, straight, objective, and candid.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">SAY PLEASE</h4>
              <p>
                One can't say please enough. Always remind yourself of the way you would think about them in their
                presence. Remember: Always be friendly & professional, never casual & formal.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">SAY SORRY</h4>
              <p>
                If you made a mistake, apologise. Saying sorry is not a sign of weakness but one of the strengths. The
                people that do the most will likely make more mistakes.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">GET TO KNOW EACH OTHER</h4>
              <p>
                We use a lot of text based communication and if you know the person behind the text it will be easier to
                prevent conflicts. So, encourage people to get to know each other on a personal level, this can be done
                during tea breaks and lunch!
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">NO EGO</h4>
              <p>
                Don't defend a point to win an argument or double-down on a mistake. You are not your work, you don't
                have to defend your point. We always need to search for the right answer together. Remember: It's not
                you against your colleague, it's you and your colleague against the problem.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">DO NOT PULL RANK OR USE AUTHORITY TO GET THINGS DONE</h4>
              <p>
                Do not use "authority" or the name of another team member to get a colleague to help you or a client to
                listen to you. Establish the context and ask for whatever is needed because the work demands it
                irrespective of hierarchy.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">ACRONYMS SERIOUSLY SUCK</h4>
              <p>
                Before creating or adopting an acronym, please take a moment to consider if it helps or impedes
                communication. Most acronyms are pointless, and only serve to create a class of people who bandy them
                about to prove they are "in the know." Thus, alienating others who don't know, and who feel too
                embarrassed to ask.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">MEASURE RESULTS NOT HOURS</h4>
              <p>
                We care about what you achieve; the code you shipped, the user you made happy, and the team member you
                helped. Do not compete by proclaiming how many hours you worked yesterday because we don't want someone
                who took the afternoon off to feel like they did something wrong. Instead, celebrate yours and your
                teammates achievements. You don't have to explain how you spent your day, we trust team members to do
                the right thing instead of having rigid rules.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">BE HAPPY WHEN OTHERS SUCCEED</h4>
              <p>
                We are here to help each other achieve their true potential, which is, incidentally, much more than any
                of us think is possible.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">OWNERSHIP</h4>
              <p>
                We expect team members to complete tasks that they are assigned. Having a task means you are responsible
                for anticipating and solving problems. As an owner you are responsible for overcoming challenges, not
                suppliers, or other team members. Take initiatives and proactively inform stakeholders when there is
                something you might not be able to solve. Done means we can responsibly communicate done to all
                stakeholders with no stories. Either it's done and there are notes OR it's not done and there are
                stories. Essentially, there is no time for excuses. And finally, you shouldn't need someone to give you
                a list of things to do every morning, if that's happening, nobody is doing their jobs, and things need
                to be fixed.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">SENSE OF URGENCY</h4>
              <p>
                At an exponentially scaling startup time gained or lost has compounding effects. Try to get the results
                as fast as possible so the compounding of results can begin and we can focus on the subsequent
                improvements.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">EXISTENTIAL ISSUES</h4>
              <p>
                Everyone hired is relatively smart and will easily get a job elsewhere. Nobody's parents are endorsing
                the decision to work here. For example, elders in Kaivalya's family wanted him to continue working at
                Isha Life. But, he believes that in order to retire early, and pursue full-time focus on one particular
                thing, one needs to build a multi-crore level business with efficient processes, systems and SOPs. And
                experience the child-like joy and thrill that comes from building the same.
              </p>
              <p>
                This business is what WE are building! Twelve months from now, the collective impact of our
                contributions will make our elders proud. However, some of us will transform as alumni and go on to do
                other things. RESPECT & UTILISE the current moments with peers to build memories in order to learn,
                teach, and influence forever.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">BE EARLY</h4>
              <p>Don't be just on time. Remember: Early bird catches the grain. [It's a vegetarian bird]</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">BORING SOLUTIONS</h4>
              <p>
                Use the most simple and boring solution for a problem. You can always make it more complex later if that
                is required.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">RTFM</h4>
              <p>
                Before asking a colleague a question, do a simple Google search and see if it's something you can do on
                your own. This not only saves time, but also respects your peers' time.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">THERE ARE NO STUPID QUESTIONS</h4>
              <p>
                While doing your peers the courtesy of a Google search before asking them questions, please also focus
                on creating an atmosphere where no question is too stupid. which is in fact, the truth. Having people
                feel that their question is stupid will only stop them from learning, in order to not be thought of as
                stupid. It's the exact opposite of what we need.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">RECIPROCATE FLEXIBILITY WITH PREDICTABILITY</h4>
              <p>
                There is a lot of flexibility here, reciprocate it with predictability. Else this won't work and is
                unfair to the others.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">ZERO TOLERANCE ON HARASSMENT AND DISCRIMINATION</h4>
              <p>
                We have a zero tolerance policy towards harassment, exclusion, discrimination, or retaliation by/of any
                community members, including our employees.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">DON'T BRING RELIGION OR POLITICS TO WORK</h4>
              <p>
                We don't discuss religion or politics because it is easy to alienate people that have a minority
                opinion.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md my-3 text-sm">
              <h4 className="text-lg font-bold mb-2">QUIRKINESS</h4>
              <p>
                Unexpected and unconventional things make life more interesting. Celebrate and encourage quirky gifts,
                habits, behaviors, and point of views.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md my-6 border-l-4 border-blue-500">
              <p className="font-bold">Please Note:</p>
              <ol className="list-decimal list-inside mt-2">
                <li>
                  If you want to discontinue your position at Maitreya Labs, you will have to notify us 15 days in
                  advance.
                </li>
                <li>Integrity breaches will lead to the termination of our relationship.</li>
              </ol>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="values-read"
              checked={valuesRead}
              onCheckedChange={(checked) => setValuesRead(checked === true)}
            />
            <Label htmlFor="values-read" className="font-medium">
              I have read and understood the values and policies of Maitreya Labs
            </Label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Proceed <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">Copyright 2025, Maitreya Labs</div>
        </form>
      </div>
    )
  }

  // Render Step 5 form - Roadmap
  if (stepNumber === 5) {
    return (
      <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-xl p-6 sm:p-8 animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Maitreya Labs</h2>
          <p className="text-muted-foreground">Step 05: Roadmap</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="prose prose-sm max-w-none dark:prose-invert overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-2">
                    <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </span>
                  Roadmap Videos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <a
                    href="https://youtu.be/1bWAfgElne8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-blue-500 p-2 rounded-full mr-3 group-hover:bg-blue-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Roadmap Overview</span>
                  </a>
                  <a
                    href="https://youtu.be/K6SwPslThyY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-blue-500 p-2 rounded-full mr-3 group-hover:bg-blue-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Roadmap Details</span>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center">
                  <span className="bg-purple-100 dark:bg-purple-800 p-2 rounded-full mr-2">
                    <ExternalLink className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </span>
                  Three Things
                </h3>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  <a
                    href="https://youtu.be/C8W0jJWS43w"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-purple-500 p-2 rounded-full mr-3 group-hover:bg-purple-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Three Things You Need to Know</span>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center">
                  <span className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-2">
                    <ExternalLink className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </span>
                  Notion Tutorials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <a
                    href="https://youtu.be/nN1ZpFGMwtU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-green-500 p-2 rounded-full mr-3 group-hover:bg-green-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Notion Basics</span>
                  </a>
                  <a
                    href="https://youtu.be/0d7nUfRw1MI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-green-500 p-2 rounded-full mr-3 group-hover:bg-green-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Advanced Features</span>
                  </a>
                  <a
                    href="https://youtu.be/D10lFJ2nE5g"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-green-500 p-2 rounded-full mr-3 group-hover:bg-green-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Collaboration Tools</span>
                  </a>
                  <a
                    href="https://youtu.be/7FWBHsFL268"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-green-500 p-2 rounded-full mr-3 group-hover:bg-green-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Project Management</span>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-300 mb-4 flex items-center">
                  <span className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full mr-2">
                    <ExternalLink className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                  </span>
                  Basecamp
                </h3>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  <a
                    href="https://youtu.be/MLyAb-LvQ1Y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-amber-500 p-2 rounded-full mr-3 group-hover:bg-amber-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Basecamp Essentials</span>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center">
                  <span className="bg-red-100 dark:bg-red-800 p-2 rounded-full mr-2">
                    <ExternalLink className="h-5 w-5 text-red-600 dark:text-red-300" />
                  </span>
                  CRM Tutorials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <a
                    href="https://youtu.be/XZNamCg93Co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-red-500 p-2 rounded-full mr-3 group-hover:bg-red-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">CRM Basics</span>
                  </a>
                  <a
                    href="https://youtu.be/FQA1njR3T_U"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-red-500 p-2 rounded-full mr-3 group-hover:bg-red-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Advanced CRM</span>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-sky-800 dark:text-sky-300 mb-4 flex items-center">
                  <span className="bg-sky-100 dark:bg-sky-800 p-2 rounded-full mr-2">
                    <ExternalLink className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                  </span>
                  Google Space
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <a
                    href="https://youtu.be/VhbWaJQy5zM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-sky-200 dark:border-sky-800 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-sky-500 p-2 rounded-full mr-3 group-hover:bg-sky-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Getting Started</span>
                  </a>
                  <a
                    href="https://youtu.be/pMGp9I8Ov9g"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-sky-200 dark:border-sky-800 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-800/50 transition-colors group text-sm"
                  >
                    <div className="bg-sky-500 p-2 rounded-full mr-3 group-hover:bg-sky-600 transition-colors">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Collaboration</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 p-6 rounded-xl shadow-sm border-l-4 border-gray-400 dark:border-gray-600 my-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Please Note:</h3>
              <ol className="list-decimal pl-5 space-y-3">
                <li className="text-sm text-gray-700 dark:text-gray-300">
                  If you want to discontinue your position at Maitreya Labs, you will have to notify us 15 days in
                  advance.
                </li>
                <li className="text-sm text-gray-700 dark:text-gray-300">
                  Integrity breaches will lead to the termination of our relationship.
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl shadow-sm border-l-4 border-green-500 dark:border-green-700 my-8">
              <h3 className="text-xl font-bold mb-4 text-green-800 dark:text-green-300">
                Thank You! Here are the next steps:
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                Click the button below to access your project management dashboard. This will take you to the right
                project management link where you can start your work.
              </p>
            </div>
          </div>

          <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="videos-watched"
                checked={videosWatched}
                onCheckedChange={(checked) => setVideosWatched(checked)}
                className="h-5 w-5"
              />
              <Label htmlFor="videos-watched" className="font-medium text-base">
                I have watched the tutorial videos
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="next-steps-read"
                checked={nextStepsRead}
                onCheckedChange={(checked) => setNextStepsRead(checked)}
                className="h-5 w-5"
              />
              <Label htmlFor="next-steps-read" className="font-medium text-base">
                I understand the next steps
              </Label>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center mt-8">
            <a
              href="https://ticktick.com/pub/project/collaboration/invite/9239d23c7a7144759702d6c802e4eb98?u=6d9ea2da0a274ab4b68daffa4e4b4a4f"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 text-base font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Access TickTick Dashboard <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </div>
        </form>
      </div>
    )
  }

  // For other steps, return a placeholder
  return (
    <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-xl p-6 sm:p-8 animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Maitreya Labs</h2>
        <p className="text-muted-foreground">Step {stepNumber}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 bg-secondary/50 rounded-lg text-center">
          <p>Form content for Step {stepNumber}</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
