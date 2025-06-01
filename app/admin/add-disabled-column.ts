"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function addDisabledColumn() {
  try {
    // Check if the column already exists
    const checkColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'submissions' 
      AND column_name = 'disabled'
    `

    if (checkColumn.length === 0) {
      // Add the disabled column if it doesn't exist
      await sql`
        ALTER TABLE submissions 
        ADD COLUMN disabled BOOLEAN DEFAULT FALSE
      `
      console.log("Added 'disabled' column to submissions table")
    } else {
      console.log("'disabled' column already exists")
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding disabled column:", error)
    return { success: false, error: "Failed to add disabled column" }
  }
}
