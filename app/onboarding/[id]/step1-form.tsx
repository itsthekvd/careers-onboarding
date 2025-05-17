"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { submitStep1Form } from "./step1-form-actions"

export function OnboardingStep1Form({ submissionId, token }: { submissionId: string; token: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [agreementConsent, setAgreementConsent] = useState(false)
  const [attachmentConsent, setAttachmentConsent] = useState(false)
  const [signature, setSignature] = useState<string>("")
  const [attachmentSignature, setAttachmentSignature] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const attachmentCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isDrawingAttachment, setIsDrawingAttachment] = useState(false)

  // Initialize canvas
  const initCanvas = (canvas: HTMLCanvasElement | null, color = "black") => {
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.strokeStyle = color
      }
    }
  }

  // Handle drawing on canvas
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    setDrawing: (drawing: boolean) => void,
  ) => {
    setDrawing(true)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        let x, y
        if ("touches" in e) {
          x = e.touches[0].clientX - rect.left
          y = e.touches[0].clientY - rect.top
        } else {
          x = e.clientX - rect.left
          y = e.clientY - rect.top
        }
        ctx.beginPath()
        ctx.moveTo(x, y)
      }
    }
  }

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    isDrawing: boolean,
  ) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        let x, y
        if ("touches" in e) {
          x = e.touches[0].clientX - rect.left
          y = e.touches[0].clientY - rect.top
        } else {
          x = e.clientX - rect.left
          y = e.clientY - rect.top
        }
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    }
  }

  const stopDrawing = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    setDrawing: (drawing: boolean) => void,
    setSignature: (signature: string) => void,
  ) => {
    setDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      setSignature(canvas.toDataURL())
    }
  }

  const clearSignature = (canvasRef: React.RefObject<HTMLCanvasElement>, setSignature: (signature: string) => void) => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setSignature("")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!firstName || !lastName || !email || !phone) {
      setError("All fields are required")
      return
    }

    if (!agreementConsent) {
      setError("You must agree to the internship agreement")
      return
    }

    if (!attachmentConsent) {
      setError("You must agree to the confidential information agreement")
      return
    }

    if (!signature || !attachmentSignature) {
      setError("Please sign both agreements")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("firstName", firstName)
      formData.append("lastName", lastName)
      formData.append("email", email)
      formData.append("whatsapp", phone) // Using whatsapp field for phone as per backend
      formData.append("agreementConsent", agreementConsent.toString())
      formData.append("attachmentConsent", attachmentConsent.toString())
      formData.append("signature", signature)
      formData.append("attachmentSignature", attachmentSignature)

      const result = await submitStep1Form(submissionId, token, formData)

      if (result.success) {
        console.log("Form submitted successfully, redirecting to step 2")
        router.push(`/onboarding/${submissionId}/step/2?token=${token}`)
      } else {
        console.error("Form submission failed:", result.error)
        setError(result.error || "Failed to submit form. Please try again.")
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-card rounded-lg shadow-xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Maitreya Labs</h2>
        <p className="text-muted-foreground">Step 01: Internship Agreement</p>
        <p className="text-sm mt-2">You will be redirected to the next steps after the agreement is signed.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name*
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name*
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="block text-sm font-medium mb-1">
            Current E-Mail Address*
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number*
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Agreement</h3>
          <div className="bg-gray-50 p-4 rounded-md mb-4 max-h-60 overflow-y-auto text-sm">
            <p className="mb-4">
              I am pleased to offer you an educational internship opportunity, detailed as below, Prathamesh Jeurkar
              ("Coordinator") is engaged in projects called Maitreya Labs which involves, inter alia, the creation,
              organization, and management of an e-commerce based platform, and the creation of bespoke software for
              clients ("Project").
            </p>
            <p className="mb-4">
              Your internship shall be governed by the following terms and conditions (this "Agreement"):
            </p>
            <h4 className="font-bold mb-2">Duties and Scope of Internship</h4>
            <p className="mb-4">
              1. Position. For the term of your internship under this Agreement (your "Internship"), the Coordinator
              agrees to engage you in the position of Research Intern, or in such other position as the Coordinator
              subsequently may assign to you.
            </p>
            <p className="mb-4">
              You will report to Coordinator or such other person as the Coordinator subsequently may determine. You
              will be working out remotely or in such a place as is mutually agreed between you and the Coordinator.
            </p>
            <p className="mb-4">
              You will perform the duties and have the responsibilities and authority as may be assigned or delegated to
              you.
            </p>
            <h4 className="font-bold mb-2">Obligations to the Coordinator</h4>
            <p className="mb-4">
              During your internship, you shall devote your full business efforts and time to the Project. During your
              internship, without the prior written approval of the Coordinator, you shall not render services in any
              capacity to any other person or entity and shall not act as a sole proprietor or partner of any other
              person or entity.
            </p>
            <p className="mb-4">
              You shall comply with the Coordinator's policies and rules, as they may be in effect from time to time
              during your internship.
            </p>
            <h4 className="font-bold mb-2">No Conflicting Obligations</h4>
            <p className="mb-4">
              You represent and warrant to the Coordinator that you are under no obligations or commitments, whether
              contractual or otherwise, that are inconsistent with your obligations under this Agreement.
            </p>
            <p className="mb-4">
              In connection with your internship, you shall not use or disclose any trade secrets or other proprietary
              information or intellectual property in which you or any other person has any right, title or interest,
              and your internship will not infringe or violate the rights of any other person. You represent and warrant
              to the Coordinator that you have returned all property and confidential information belonging to any prior
              employer.
            </p>
            <h4 className="font-bold mb-2">Commencement Date</h4>
            <p className="mb-4">
              The commencement date for your part-time internship is separately agreed upon between you and Prathamesh
              Jeurkar.
            </p>
            <h4 className="font-bold mb-2">Compensation</h4>
            <p className="mb-4">
              The Coordinator shall pay you as compensation for your services, a monthly stipend/salary as agreed
              separately between you and the Coordinator.
            </p>
            <p className="mb-4">This also includes the extra bonuses wherever applicable.</p>
            <h4 className="font-bold mb-2">Business Expenses</h4>
            <p className="mb-4">
              The Coordinator will reimburse you for your necessary and reasonable business expenses incurred in
              connection with your duties hereunder upon presentation of an itemized account and appropriate supporting
              documentation, all in accordance with the Coordinator's generally applicable policies.
            </p>
            <h4 className="font-bold mb-2">Termination</h4>
            <p className="mb-4">
              1. Engagement at Will. Your internship shall be "at will," meaning that either you or the Coordinator
              shall be entitled to terminate your internship at any time and for any reason, with or without cause. This
              Agreement shall constitute the full and complete agreement between you and the Coordinator on the "at-
              will" nature of your internship, which may only be changed in an express written agreement signed by you
              and the Coordinator.
            </p>
            <p className="mb-4">
              2. Rights Upon Termination. Except as expressly provided in this Agreement, upon the termination of your
              internship, you shall only be entitled to the compensation and the reimbursements described in this
              Agreement for the period preceding the effective date of the termination.
            </p>
            <h4 className="font-bold mb-2">Pre-internship Conditions</h4>
            <p className="mb-4">
              This offer of the internship is contingent upon the successful verification of the information you
              provided to the Coordinator during your application process, as well as a general background check
              performed by the Coordinator to confirm your suitability for the internship. By accepting this offer of
              the internship, you warrant that all information provided by you is true and correct to the best of your
              knowledge.
            </p>
            <p className="mb-4">
              You also represent that you understand and agree to abide by the Confidential Information and Assignment
              Agreement (Appendix A).
            </p>
            <h4 className="font-bold mb-2">Miscellaneous Provisions</h4>
            <p className="mb-4">
              1. Choice of Law and Jurisdiction. This Agreement shall be interpreted in accordance with the laws of the
              Republic of India without giving effect to provisions governing the choice of law. The Courts in
              Ahmednagar, Maharashtra shall have exclusive jurisdiction of any dispute arising out of this Agreement. We
              are all delighted to be able to extend you this offer and look forward to working with you.
            </p>
            <p className="mb-4">
              To indicate your acceptance of the Coordinator's offer, please sign and date this letter in the space
              provided below and return it to me, on or before such date as is agreed upon. Truly, Prathamesh Jeurkar
              Maitreya Labs
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreementConsent"
                checked={agreementConsent}
                onCheckedChange={(checked) => setAgreementConsent(checked === true)}
              />
              <Label htmlFor="agreementConsent" className="text-sm">
                I agree and accept.
              </Label>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2">Signature</Label>
              <div className="border border-gray-300 rounded-md p-2 mb-2 bg-white">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={150}
                  className="w-full touch-none"
                  onMouseDown={(e) => startDrawing(e, canvasRef, setIsDrawing)}
                  onMouseMove={(e) => draw(e, canvasRef, isDrawing)}
                  onMouseUp={() => stopDrawing(canvasRef, setIsDrawing, setSignature)}
                  onMouseLeave={() => stopDrawing(canvasRef, setIsDrawing, setSignature)}
                  onTouchStart={(e) => startDrawing(e, canvasRef, setIsDrawing)}
                  onTouchMove={(e) => draw(e, canvasRef, isDrawing)}
                  onTouchEnd={() => stopDrawing(canvasRef, setIsDrawing, setSignature)}
                  onClick={() => initCanvas(canvasRef.current)}
                ></canvas>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => clearSignature(canvasRef, setSignature)}>
                Clear Signature
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Attachment A: Confidential Information and Invention Assignment Agreement
          </h3>
          <div className="bg-gray-50 p-4 rounded-md mb-4 max-h-60 overflow-y-auto text-sm">
            <p className="mb-4">
              ATTACHMENT A CONFIDENTIAL INFORMATION AND INVENTION ASSIGNMENT AGREEMENT As a condition of my becoming
              engaged with (or my engagement being continued) by Prathamesh Jeurkar, for one of the projects the former
              works on, including Maitreya Labs (collectively, the "Coordinator"), and in consideration of my engagement
              with the Coordinator and my receipt of the compensation now and hereafter paid to me by the Coordinator, I
              agree to the following:
            </p>
            <h4 className="font-bold mb-2">1. Relationship</h4>
            <p className="mb-4">
              This Agreement will apply to my [internship / consultation] relationship with the Coordinator. If that
              relationship ends and the Coordinator, within a year thereafter, either reemploys me or engages me as a
              consultant, I agree that this Agreement will also apply to such later employment or consulting
              relationship, unless the Coordinator and I otherwise agree in writing.
            </p>
            <p className="mb-4">
              Any such employment or consulting relationship between the Coordinator and me, whether commenced prior to,
              upon or after the date of this Agreement is referred to herein as the "Relationship."
            </p>
            <h4 className="font-bold mb-2">2. Duties.</h4>
            <p className="mb-4">
              I will perform for the Coordinator such duties as may be designated by the Coordinator from time to time
              or that are otherwise within the scope of the Relationship and not contrary to instructions from the
              Coordinator.
            </p>
            <h4 className="font-bold mb-2">3. Confidential Information.</h4>
            <p className="mb-4">
              1. Protection of Information. I agree, at all times during the term of the Relationship and for a period
              of 3 years thereafter, to hold in strictest confidence, and not to use, except for the benefit of the
              Coordinator to the extent necessary to perform my obligations to the Coordinator under the Relationship,
              and not to disclose to any person, firm, corporation or other entity, without written authorization from
              the Coordinator in each instance, any Confidential Information (as defined below) that I obtain, access or
              create during the term of the Relationship, whether or not during working hours, unless such Confidential
              Information becomes publicly and widely known and made generally available through no wrongful act of mine
              or of others who were under confidentiality obligations as to the item or items involved. I further agree
              not to make copies of such Confidential Information except as authorized by the Coordinator.
            </p>
            <h4 className="font-bold mb-2">4. Confidential Information</h4>
            <p className="mb-4">
              I understand that "Confidential Information" means any information relating to the Coordinator's
              Project(s) disclosed to me during the duration of the Relationship.
            </p>
            <p className="mb-4">
              Confidential Information includes, without limitation: (i) Coordinator Inventions (as defined below); (ii)
              technical data, trade secrets, know-how, research, product or service ideas or plans, software codes and
              designs, developments, inventions, laboratory notebooks, processes, formulas, techniques, biological
              materials, mask works, engineering designs and drawings, hardware configuration information, lists of, or
              information relating to, employees and consultants of the Coordinator (including, but not limited to, the
              names, contact information, jobs, compensation, and expertise of such employees and consultants), lists
              of, or information relating to, suppliers and customers (including, but not limited to, customers of the
              Coordinator on whom I called or with whom I became acquainted during the Relationship), price lists,
              pricing methodologies, cost data, market share data, marketing plans, licenses, contract information,
              business plans, financial forecasts, historical financial data, budgets or other business information
              disclosed to me by the Coordinator either directly or indirectly, whether in writing, electronically,
              orally, or by observation.
            </p>
            <h4 className="font-bold mb-2">Third Party Information</h4>
            <p className="mb-4">
              My agreements in this Section are intended to be for the benefit of the Coordinator and any third party
              that has entrusted information or physical material to the Coordinator in confidence.
            </p>
            <h4 className="font-bold mb-2">Other Rights</h4>
            <p className="mb-4">
              This Agreement is intended to supplement, and not to supersede, any rights the Coordinator may have in law
              or equity with respect to the protection of trade secrets or confidential or proprietary information.
            </p>
            <h4 className="font-bold mb-2">Ownership of Inventions</h4>
            <p className="mb-4">
              I understand that "Inventions" means discoveries, developments, concepts, designs, ideas, know-how,
              improvements, inventions, trade secrets and/or original works of authorship, whether or not patentable,
              copyrightable or otherwise legally protectable. I understand this includes, but is not limited to, any new
              product, machine, article of manufacture, method, procedure, process, technique, use, equipment, device,
              apparatus, system, compound, formulation, the composition of matter, design or configuration of any kind,
              or any improvement thereon. "Coordinator Inventions" means any and all Inventions that I may solely or
              jointly author, discover, develop, conceive, or reduce to practice during the period of the Relationship.
            </p>
            <p className="mb-4">
              It is clarified that the extent of Coordinator Inventions shall only extend to such Inventions done on the
              Coordinator's time and using the Coordinator's resources, on the Coordinator's Projects. Any Inventions
              not relating to the Projects shall not be covered under the scope of this provision.
            </p>
            <h4 className="font-bold mb-2">Assignment of Coordinator Inventions</h4>
            <p className="mb-4">
              I agree that I will promptly make full written disclosure to the Coordinator, will hold in trust for the
              sole right and benefit of the Coordinator, and hereby assign to the Coordinator, or its designee, all my
              right, title and interest throughout the world in and to any and all Coordinator Inventions.
            </p>
            <p className="mb-4">
              I further acknowledge that all Coordinator Inventions that are made by me (solely or jointly with others)
              within the scope of and during the period of the Relationship are "works made for hire" (to the greatest
              extent permitted by applicable law) and are compensated by my salary. I hereby waive and irrevocably
              quitclaim to the Coordinator or its designee any and all claims, of any nature whatsoever, that I now have
              or may hereafter have for infringement of any and all Coordinator Inventions.
            </p>
            <h4 className="font-bold mb-2">Use of Coordinator Inventions</h4>
            <p className="mb-4">
              I agree that I shall not use Coordinator Inventions outside of what is necessary for the Service. I agree
              that I shall not use Coordinator Inventions for the purposes of promotional, marketing or sales activity
              without the express written consent of the Coordinator.
            </p>
            <h4 className="font-bold mb-2">Coordinator Property</h4>
            <p className="mb-4">
              Returning Coordinator Documents. I agree that, at the time of termination of the Relationship, I will
              deliver to the Coordinator (and will not keep in my possession, recreate or deliver to anyone else) any
              and all devices, records, data, notes, reports, proposals, lists, correspondence, specifications,
              drawings, blueprints, sketches, laboratory notebooks, materials, flow charts, equipment, other documents
              or property, or reproductions of any of the aforementioned items developed by me pursuant to the
              Relationship or otherwise belonging to the Coordinator, its successors or assigns.
            </p>
            <h4 className="font-bold mb-2">Solicitation of Employees, Consultants, and Other Parties</h4>
            <p className="mb-4">
              As described above, I acknowledge and agree that the Coordinator's Confidential Information includes
              information relating to the Coordinator's employees, consultants, customers and others and that I will not
              use or disclose such Confidential Information except as authorized by the Coordinator.
            </p>
            <p className="mb-4">
              I agree that during the term of the Relationship, and for a period of twelve (12) months immediately
              following the termination of the Relationship for any reason, whether with or without cause, I shall not
              either directly or indirectly solicit, induce, recruit or encourage any of the Coordinator's employees or
              consultants to terminate their relationship with the Coordinator, or attempt to solicit, induce, recruit,
              encourage or take away employees or consultants of the Coordinator, either for myself or for any other
              person or entity.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="attachmentConsent"
                checked={attachmentConsent}
                onCheckedChange={(checked) => setAttachmentConsent(checked === true)}
              />
              <Label htmlFor="attachmentConsent" className="text-sm">
                I have read the complete internship agreement and I agree to it.
              </Label>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2">Signature</Label>
              <div className="border border-gray-300 rounded-md p-2 mb-2 bg-white">
                <canvas
                  ref={attachmentCanvasRef}
                  width={500}
                  height={150}
                  className="w-full touch-none"
                  onMouseDown={(e) => startDrawing(e, attachmentCanvasRef, setIsDrawingAttachment)}
                  onMouseMove={(e) => draw(e, attachmentCanvasRef, isDrawingAttachment)}
                  onMouseUp={() => stopDrawing(attachmentCanvasRef, setIsDrawingAttachment, setAttachmentSignature)}
                  onMouseLeave={() => stopDrawing(attachmentCanvasRef, setIsDrawingAttachment, setAttachmentSignature)}
                  onTouchStart={(e) => startDrawing(e, attachmentCanvasRef, setIsDrawingAttachment)}
                  onTouchMove={(e) => draw(e, attachmentCanvasRef, isDrawingAttachment)}
                  onTouchEnd={() => stopDrawing(attachmentCanvasRef, setIsDrawingAttachment, setAttachmentSignature)}
                  onClick={() => initCanvas(attachmentCanvasRef.current)}
                ></canvas>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => clearSignature(attachmentCanvasRef, setAttachmentSignature)}
              >
                Clear Signature
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="mr-2">Submitting...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></div>
            </>
          ) : (
            "Submit"
          )}
        </Button>

        <div className="text-center text-xs text-muted-foreground">Copyright 2025, Maitreya Labs</div>
      </form>
    </div>
  )
}
