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
  theory: z.string().describe('The generated background theory for the given topic.'),
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
  prompt: `You are an expert computer science educator. Generate background theory for the following topic:

Topic: {{{topic}}}

Theory:`, // Output should be a comprehensive yet concise explanation of core concepts.
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
