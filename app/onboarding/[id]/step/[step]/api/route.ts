import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function POST(request: NextRequest, { params }: { params: { id: string; step: string } }) {
  const { id, step } = params
  const token = request.headers.get("x-onboarding-token")

  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 })
  }

  try {
    // Validate the token
    const tokenResult = await sql`
      SELECT id FROM submissions 
      WHERE id = ${id} 
      AND onboarding_token = ${token}
    `

    const isValid = tokenResult && Array.isArray(tokenResult) && tokenResult.length > 0

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const formData = await request.formData()

    if (step === "5") {
      const videosWatched = formData.get("videosWatched") as string
      const nextStepsRead = formData.get("nextStepsRead") as string
      const questions = formData.get("questions") as string

      // Check if data for this step already exists
      const existingData = await sql`
        SELECT id FROM onboarding_data 
        WHERE submission_id = ${id} AND step = 5
      `

      const dataExists = existingData && Array.isArray(existingData) && existingData.length > 0

      const stepData = {
        videosWatched,
        nextStepsRead,
        questions,
        step: 5,
        submittedAt: new Date().toISOString(),
      }

      if (dataExists) {
        // Update existing data
        await sql`
          UPDATE onboarding_data 
          SET data = ${JSON.stringify(stepData)}
          WHERE submission_id = ${id} AND step = 5
        `
      } else {
        // Insert new data
        await sql`
          INSERT INTO onboarding_data (submission_id, step, data)
          VALUES (${id}, 5, ${JSON.stringify(stepData)})
        `
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Invalid step" }, { status: 400 })
  } catch (error) {
    console.error("Error processing form submission:", error)
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 })
  }
}
