"use server";

import { z } from "zod";
import { validateLearningRepayment } from "@/ai/flows/validate-learning-repayment";

const VideoRepaymentSchema = z.object({
  submissionType: z.enum(["diagramReconstruction", "teachBackExplanation"]),
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  videoDataUri: z.string().startsWith("data:video", "Invalid video file."),
});

type ValidationResult = {
  success: boolean;
  data?: {
    isValid: boolean;
    feedback: string;
    timeCreditMinutes: number;
  };
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function validateVideoRepaymentAction(
  prevState: any,
  formData: FormData
): Promise<ValidationResult> {
  const submissionType = formData.get("submissionType");
  const topic = formData.get("topic");
  const videoDataUri = formData.get("videoDataUri");

  const validatedFields = VideoRepaymentSchema.safeParse({
    submissionType,
    topic,
    videoDataUri,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid form data.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await validateLearningRepayment(validatedFields.data);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error validating video repayment:", error);
    return { success: false, error: "An unexpected error occurred during validation." };
  }
}
