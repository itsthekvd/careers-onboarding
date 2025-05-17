"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL)

export async function validateOnboardingToken(submissionId: string, token: string) {
  try {
    console.log(`Validating token for submission ${submissionId} with token ${token.substring(0, 5)}...`)

    // Check if the parameters are valid
    if (!submissionId || !token) {
      console.log("Missing submissionId or token")
      return false
    }

    // Query the database to validate the token
    const result = await sql`
      SELECT id FROM submissions 
      WHERE id = ${submissionId} 
      AND onboarding_token = ${token}
    `

    console.log("Token validation query result:", result)

    // Check if we got a valid result
    const isValid = result && (Array.isArray(result) ? result.length > 0 : result.rows && result.rows.length > 0)

    console.log(`Token validation result: ${isValid}`)

    return isValid
  } catch (error) {
    console.error("Error validating token:", error)
    return false
  }
}

export async function getCurrentStep(submissionId: string) {
  try {
    console.log(`Getting current step for submission ${submissionId}`)

    // First check if the users table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as exists
    `

    const tableExists = tableCheck && tableCheck[0] && tableCheck[0].exists

    if (!tableExists) {
      console.log("Users table does not exist yet, returning step 1")
      return 1
    }

    // Now query for the user
    const result = await sql`
      SELECT current_step FROM users 
      WHERE submission_id = ${submissionId}
    `

    console.log("Current step query result:", result)

    // Handle different response formats
    if (result && Array.isArray(result) && result.length > 0) {
      const step = result[0].current_step || 1
      console.log(`Found current step: ${step}`)
      return step
    } else if (result && result.rows && result.rows.length > 0) {
      const step = result.rows[0].current_step || 1
      console.log(`Found current step: ${step}`)
      return step
    }

    console.log("No user record found, returning step 1")
    return 1 // Default to step 1 if no record exists
  } catch (error) {
    console.error("Error getting current step:", error)
    return 1 // Default to step 1 on error
  }
}

export async function updateOnboardingStep(submissionId: string, token: string, step: number, formData: FormData) {
  try {
    // Validate the token first
    const isValid = await validateOnboardingToken(submissionId, token)

    if (!isValid) {
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

    // Check if user exists for this submission
    const userCheck = await sql`
      SELECT id FROM users WHERE submission_id = ${submissionId}
    `

    const userExists =
      userCheck && (Array.isArray(userCheck) ? userCheck.length > 0 : userCheck.rows && userCheck.rows.length > 0)

    if (step === 1) {
      // For step 1, we collect basic information and agreement details
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string
      const name = `${firstName} ${lastName}`
      const email = formData.get("email") as string
      const whatsapp = formData.get("whatsapp") as string
      const agreementConsent = formData.get("agreementConsent") as string
      const attachmentConsent = formData.get("attachmentConsent") as string
      const signature = formData.get("signature") as string
      const attachmentSignature = formData.get("attachmentSignature") as string

      if (!firstName || !lastName || !email || !whatsapp) {
        return {
          success: false,
          error: "All fields are required",
        }
      }

      // Create or update the onboarding_data table to store agreement details
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

      // Check if data for this step already exists
      const existingData = await sql`
        SELECT id FROM onboarding_data 
        WHERE submission_id = ${submissionId} AND step = ${step}
      `

      const dataExists =
        existingData &&
        (Array.isArray(existingData) ? existingData.length > 0 : existingData.rows && existingData.rows.length > 0)

      if (dataExists) {
        // Update existing data
        await sql`
          UPDATE onboarding_data 
          SET data = ${JSON.stringify(agreementData)}
          WHERE submission_id = ${submissionId} AND step = ${step}
        `
      } else {
        // Insert new data
        await sql`
          INSERT INTO onboarding_data (submission_id, step, data)
          VALUES (${submissionId}, ${step}, ${JSON.stringify(agreementData)})
        `
      }

      if (userExists) {
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
        // Create new user
        await sql`
          INSERT INTO users (submission_id, name, email, whatsapp, current_step)
          VALUES (${submissionId}, ${name}, ${email}, ${whatsapp}, 2)
        `
      }

      // Update submission status
      await sql`
        UPDATE submissions 
        SET status = 'onboarding' 
        WHERE id = ${submissionId}
      `
    } else if (step === 2) {
      // For step 2, we collect personal information, documents, and preferences
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string
      const email = formData.get("email") as string
      const whatsapp = formData.get("whatsapp") as string
      const position = formData.get("position") as string
      const birthday = formData.get("birthday") as string

      // Introduction fields
      const introduction = formData.get("introduction") as string
      const quirk = formData.get("quirk") as string
      const hobbies = formData.get("hobbies") as string
      const favoriteFood = formData.get("favoriteFood") as string
      const persona = formData.get("persona") as string
      const favoriteBook = formData.get("favoriteBook") as string
      const systemSpecs = formData.get("systemSpecs") as string
      const learningGoal = formData.get("learningGoal") as string
      const futureSkillset = formData.get("futureSkillset") as string

      // Social media
      const facebook = formData.get("facebook") as string
      const instagram = formData.get("instagram") as string
      const linkedin = formData.get("linkedin") as string
      const twitter = formData.get("twitter") as string

      // Internship details
      const bankDetails = formData.get("bankDetails") as string
      const startTime = formData.get("startTime") as string
      const lunchPreference = formData.get("lunchPreference") as string

      // Document previews (as data URLs)
      const panFrontPreview = formData.get("panFrontPreview") as string
      const panBackPreview = formData.get("panBackPreview") as string
      const aadharFrontPreview = formData.get("aadharFrontPreview") as string
      const aadharBackPreview = formData.get("aadharBackPreview") as string

      // Store the step 2 data
      const step2Data = {
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
        panFrontPreview,
        panBackPreview,
        aadharFrontPreview,
        aadharBackPreview,
        step: 2,
        submittedAt: new Date().toISOString(),
      }

      // Check if data for this step already exists
      const existingData = await sql`
        SELECT id FROM onboarding_data 
        WHERE submission_id = ${submissionId} AND step = ${step}
      `

      const dataExists =
        existingData &&
        (Array.isArray(existingData) ? existingData.length > 0 : existingData.rows && existingData.rows.length > 0)

      if (dataExists) {
        // Update existing data
        await sql`
          UPDATE onboarding_data 
          SET data = ${JSON.stringify(step2Data)}
          WHERE submission_id = ${submissionId} AND step = ${step}
        `
      } else {
        // Insert new data
        await sql`
          INSERT INTO onboarding_data (submission_id, step, data)
          VALUES (${submissionId}, ${step}, ${JSON.stringify(step2Data)})
        `
      }

      // Update user's current step
      await sql`
        UPDATE users 
        SET 
          current_step = 3,
          updated_at = CURRENT_TIMESTAMP
        WHERE submission_id = ${submissionId}
      `
    } else {
      // For other steps, just update the current step
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
      }
    }

    // Revalidate paths after all database operations
    revalidatePath(`/onboarding/${submissionId}`)
    revalidatePath(`/admin`)

    return {
      success: true,
      nextStep: step < 5 ? step + 1 : null,
    }
  } catch (error) {
    console.error(`Error updating onboarding step ${step}:`, error)
    return {
      success: false,
      error: "Failed to update. Please try again.",
    }
  }
}
