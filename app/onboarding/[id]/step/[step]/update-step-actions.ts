"use server"

import { updateUserStep } from "../../actions"

export async function updateUserStepAction(submissionId: string, token: string, step: number) {
  return updateUserStep(submissionId, token, step)
}
