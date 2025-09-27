'use server';

/**
 * @fileOverview Generates background theory for a given computer science topic.
 *
 * - generateBackgroundTheory - A function that generates background theory.
 * - GenerateBackgroundTheoryInput - The input type for the generateBackgroundTheory function.
 * - GenerateBackgroundTheoryOutput - The return type for the generateBackgroundTheory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBackgroundTheoryInputSchema = z.object({
  topic: z.string().describe('The computer science topic to generate background theory for.'),
});
export type GenerateBackgroundTheoryInput = z.infer<typeof GenerateBackgroundTheoryInputSchema>;

const GenerateBackgroundTheoryOutputSchema = z.object({
  theory: z
    .string()
    .describe('The generated, detailed, multi-paragraph background theory for the given topic.'),
});
export type GenerateBackgroundTheoryOutput = z.infer<typeof GenerateBackgroundTheoryOutputSchema>;

export async function generateBackgroundTheory(
  input: GenerateBackgroundTheoryInput
): Promise<GenerateBackgroundTheoryOutput> {
  return generateBackgroundTheoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBackgroundTheoryPrompt',
  input: {schema: GenerateBackgroundTheoryInputSchema},
  output: {schema: GenerateBackgroundTheoryOutputSchema},
  prompt: `You are an expert computer science educator. Your task is to generate a comprehensive, detailed, and multi-paragraph background theory for the following topic.

The theory should be thorough enough to provide a solid foundation for a student new to the subject. Break down complex concepts into understandable parts and explain the core ideas clearly.

Topic: {{{topic}}}

Theory:`,
});

const generateBackgroundTheoryFlow = ai.defineFlow(
  {
    name: 'generateBackgroundTheoryFlow',
    inputSchema: GenerateBackgroundTheoryInputSchema,
    outputSchema: GenerateBackgroundTheoryOutputSchema,
    retries: 3,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
