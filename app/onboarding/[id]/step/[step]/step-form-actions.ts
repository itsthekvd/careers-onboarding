"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL)

export async function submitStepForm(submissionId: string, token: string, step: number, formData: FormData) {
  console.log(`Step ${step} form submission started for:`, submissionId)

  try {
    // Validate the token
    const tokenResult = await sql`
      SELECT id FROM submissions 
      WHERE id = ${submissionId} 
      AND onboarding_token = ${token}
    `

    const isValid =
      tokenResult &&
      (Array.isArray(tokenResult) ? tokenResult.length > 0 : tokenResult.rows && tokenResult.rows.length > 0)

    if (!isValid) {
      console.error("Invalid token for submission:", submissionId)
      return {
        success: false,
        error: "Invalid token",
      }
    }

    // Ensure users table exists
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        submission_id UUID NOT NULL REFERENCES submissions(id),
        name TEXT,
        email TEXT,
        whatsapp TEXT,
        current_step INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create onboarding_data table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS onboarding_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        submission_id UUID NOT NULL REFERENCES submissions(id),
        step INTEGER NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Process form data based on step
    let stepData = {}

    if (step === 2) {
      // For step 2, we collect personal information, documents, and preferences
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string
      const email = formData.get("email") as string
      const whatsapp = formData.get("whatsapp") as string
      const position = formData.get("position") as string
      const birthday = formData.get("birthday") as string

      // Introduction fields
      const introduction = (formData.get("introduction") as string) || ""
      const quirk = (formData.get("quirk") as string) || ""
      const hobbies = (formData.get("hobbies") as string) || ""
      const favoriteFood = (formData.get("favoriteFood") as string) || ""
      const persona = (formData.get("persona") as string) || ""
      const favoriteBook = (formData.get("favoriteBook") as string) || ""
      const systemSpecs = (formData.get("systemSpecs") as string) || ""
      const learningGoal = formData.get("learningGoal") as string
      const futureSkillset = formData.get("futureSkillset") as string

      // Social media
      const facebook = (formData.get("facebook") as string) || ""
      const instagram = (formData.get("instagram") as string) || ""
      const linkedin = (formData.get("linkedin") as string) || ""
      const twitter = (formData.get("twitter") as string) || ""

      // Internship details
      const bankDetails = formData.get("bankDetails") as string
      const startTime = formData.get("startTime") as string
      const lunchPreference = formData.get("lunchPreference") as string

      // Document URLs (replacing file uploads)
      const panFrontUrl = (formData.get("panFrontUrl") as string) || ""
      const panBackUrl = (formData.get("panBackUrl") as string) || ""
      const aadharFrontUrl = (formData.get("aadharFrontUrl") as string) || ""
      const aadharBackUrl = (formData.get("aadharBackUrl") as string) || ""

      // Store the step 2 data
      stepData = {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        whatsapp,
        position,
        birthday,
        introduction,
        quirk,
        hobbies,
        favoriteFood,
        persona,
        favoriteBook,
        systemSpecs,
        learningGoal,
        futureSkillset,
        facebook,
        instagram,
        linkedin,
        twitter,
        bankDetails,
        startTime,
        lunchPreference,
        panFrontUrl,
        panBackUrl,
        aadharFrontUrl,
        aadharBackUrl,
        step: 2,
        submittedAt: new Date().toISOString(),
      }
    } else if (step === 3) {
      // For step 3, we collect workspace access information
      const workspaceSetupConfirmed = formData.get("workspaceSetupConfirmed") as string

      stepData = {
        workspaceSetupConfirmed,
        step: 3,
        submittedAt: new Date().toISOString(),
      }
    } else if (step === 4) {
      // For step 4, we collect values and preferences
      const valuesRead = formData.get("valuesRead") as string

      stepData = {
        valuesRead,
        step: 4,
        submittedAt: new Date().toISOString(),
      }
    } else if (step === 5) {
      // For step 5, we collect final onboarding checklist
      const roadmapVideosWatched = formData.get("roadmapVideosWatched") as string
      const threeThingsWatched = formData.get("threeThingsWatched") as string
      const notionTutorialsWatched = formData.get("notionTutorialsWatched") as string
      const basecampWatched = formData.get("basecampWatched") as string
      const crmTutorialsWatched = formData.get("crmTutorialsWatched") as string
      const googleSpaceWatched = formData.get("googleSpaceWatched") as string
      const nextStepsRead = formData.get("nextStepsRead") as string
      const questions = formData.get("questions") as string

      stepData = {
        roadmapVideosWatched,
        threeThingsWatched,
        notionTutorialsWatched,
        basecampWatched,
        crmTutorialsWatched,
        googleSpaceWatched,
        nextStepsRead,
        questions,
        step: 5,
        submittedAt: new Date().toISOString(),
      }
    }

    console.log(`Checking for existing data for step ${step}`)

    // Check if data for this step already exists
    const existingData = await sql`
      SELECT id FROM onboarding_data 
      WHERE submission_id = ${submissionId} AND step = ${step}
    `

    const dataExists =
      existingData &&
      (Array.isArray(existingData) ? existingData.length > 0 : existingData.rows && existingData.rows.length > 0)

    if (dataExists) {
      console.log(`Updating existing step ${step} data`)
      // Update existing data
      await sql`
        UPDATE onboarding_data 
        SET data = ${JSON.stringify(stepData)}
        WHERE submission_id = ${submissionId} AND step = ${step}
      `
    } else {
      console.log(`Inserting new step ${step} data`)
      // Insert new data
      await sql`
        INSERT INTO onboarding_data (submission_id, step, data)
        VALUES (${submissionId}, ${step}, ${JSON.stringify(stepData)})
      `
    }

    // Update user's current step
    const nextStep = step + 1
    await sql`
      UPDATE users 
      SET 
        current_step = ${nextStep},
        updated_at = CURRENT_TIMESTAMP
      WHERE submission_id = ${submissionId}
    `

    // If this is the last step, mark as completed
    if (step === 5) {
      await sql`
        UPDATE submissions 
        SET status = 'completed' 
        WHERE id = ${submissionId}
      `
    } else {
      // For any other step, ensure status is set to 'onboarding'
      await sql`
        UPDATE submissions 
        SET status = 'onboarding' 
        WHERE id = ${submissionId}
      `
    }

    // Revalidate paths after all database operations
    revalidatePath(`/onboarding/${submissionId}`)
    revalidatePath(`/admin`)

    console.log(`Step ${step} form submission completed successfully`)

    return {
      success: true,
      nextStep: step < 5 ? step + 1 : null,
    }
  } catch (error) {
    console.error(`Error in step ${step} form submission:`, error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
