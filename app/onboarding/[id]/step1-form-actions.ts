"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL)

export async function submitStep1Form(submissionId: string, token: string, formData: FormData) {
  console.log("Step 1 form submission started for:", submissionId)

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

    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const name = `${firstName} ${lastName}`
    const email = formData.get("email") as string
    const whatsapp = formData.get("whatsapp") as string
    const agreementConsent = formData.get("agreementConsent") as string
    const attachmentConsent = formData.get("attachmentConsent") as string
    const signature = formData.get("signature") as string
    const attachmentSignature = formData.get("attachmentSignature") as string

    console.log("Form data extracted:", { name, email, whatsapp })

    if (!firstName || !lastName || !email || !whatsapp) {
      return {
        success: false,
        error: "All fields are required",
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

    // Store the agreement data
    const agreementData = {
      firstName,
      lastName,
      name,
      email,
      whatsapp,
      agreementConsent,
      attachmentConsent,
      signature,
      attachmentSignature,
      step: 1,
      submittedAt: new Date().toISOString(),
    }

    console.log("Checking for existing data for step 1")

    // Check if data for this step already exists
    const existingData = await sql`
      SELECT id FROM onboarding_data 
      WHERE submission_id = ${submissionId} AND step = 1
    `

    const dataExists =
      existingData &&
      (Array.isArray(existingData) ? existingData.length > 0 : existingData.rows && existingData.rows.length > 0)

    if (dataExists) {
      console.log("Updating existing step 1 data")
      // Update existing data
      await sql`
        UPDATE onboarding_data 
        SET data = ${JSON.stringify(agreementData)}
        WHERE submission_id = ${submissionId} AND step = 1
      `
    } else {
      console.log("Inserting new step 1 data")
      // Insert new data
      await sql`
        INSERT INTO onboarding_data (submission_id, step, data)
        VALUES (${submissionId}, 1, ${JSON.stringify(agreementData)})
      `
    }

    console.log("Checking if user exists")

    // Check if user exists for this submission
    const userCheck = await sql`
      SELECT id FROM users WHERE submission_id = ${submissionId}
    `

    const userExists =
      userCheck && (Array.isArray(userCheck) ? userCheck.length > 0 : userCheck.rows && userCheck.rows.length > 0)

    if (userExists) {
      console.log("Updating existing user")
      // Update existing user
      await sql`
        UPDATE users 
        SET 
          name = ${name}, 
          email = ${email}, 
          whatsapp = ${whatsapp},
          current_step = 2,
          updated_at = CURRENT_TIMESTAMP
        WHERE submission_id = ${submissionId}
      `
    } else {
      console.log("Creating new user")
      // Create new user
      await sql`
        INSERT INTO users (submission_id, name, email, whatsapp, current_step)
        VALUES (${submissionId}, ${name}, ${email}, ${whatsapp}, 2)
      `
    }

    console.log("Updating submission status")

    // Update submission status to 'onboarding'
    await sql`
      UPDATE submissions 
      SET status = 'onboarding' 
      WHERE id = ${submissionId}
    `

    console.log("Revalidating paths")

    // Revalidate paths
    revalidatePath(`/onboarding/${submissionId}`)
    revalidatePath(`/admin`)

    console.log("Step 1 form submission completed successfully")

    return {
      success: true,
      nextStep: 2,
    }
  } catch (error) {
    console.error("Error in step 1 form submission:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
