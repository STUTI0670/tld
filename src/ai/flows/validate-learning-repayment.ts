'use server';

/**
 * @fileOverview A flow to validate video-based learning repayment submissions (diagram reconstruction, teach-back explanation).
 *
 * - validateLearningRepayment - A function that handles the validation process.
 * - ValidateLearningRepaymentInput - The input type for the validateLearningRepayment function.
 * - ValidateLearningRepaymentOutput - The return type for the validateLearningRepayment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateLearningRepaymentInputSchema = z.object({
  submissionType: z
    .enum(['diagramReconstruction', 'teachBackExplanation'])
    .describe('The type of video-based learning submission.'),
  videoDataUri: z
    .string()
    .describe(
      'The video of the submission, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected format
    ),
  topic: z.string().describe('The topic covered in the video.'),
});
export type ValidateLearningRepaymentInput = z.infer<typeof ValidateLearningRepaymentInputSchema>;

const ValidateLearningRepaymentOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the submission is valid or not.'),
  feedback: z.string().describe('Feedback on the submission.'),
  timeCreditMinutes: z
    .number()
    .describe('The amount of time credit awarded in minutes.'),
});
export type ValidateLearningRepaymentOutput = z.infer<typeof ValidateLearningRepaymentOutputSchema>;

export async function validateLearningRepayment(
  input: ValidateLearningRepaymentInput
): Promise<ValidateLearningRepaymentOutput> {
  return validateLearningRepaymentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateLearningRepaymentPrompt',
  input: {schema: ValidateLearningRepaymentInputSchema},
  output: {schema: ValidateLearningRepaymentOutputSchema},
  prompt: `You are an expert educator assessing the validity of video-based learning repayment submissions.

You will review the video submission and determine if it meets the requirements for the given submission type and topic.

Submission Type: {{{submissionType}}}
Topic: {{{topic}}}
Video: {{media url=videoDataUri}}

Based on your assessment, determine if the submission is valid (isValid: true/false), provide feedback (feedback), and award time credit in minutes (timeCreditMinutes).  Time credit should be between 30 and 60 minutes depending on how well the topic was covered and how well the video satisfies the submission type.  A teach back explanation should explain the topic back in a coherent way, while a diagram reconstruction should successfully reconstruct the diagram from memory.

Ensure that the output is formatted as a JSON object.`, // Added video data URI
});

const validateLearningRepaymentFlow = ai.defineFlow(
  {
    name: 'validateLearningRepaymentFlow',
    inputSchema: ValidateLearningRepaymentInputSchema,
    outputSchema: ValidateLearningRepaymentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
