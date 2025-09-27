'use server';

/**
 * @fileOverview Generates a flowchart for a given topic based on provided theory.
 *
 * - generateTopicFlowchart - A function that generates a flowchart.
 * - GenerateTopicFlowchartInput - The input type for the generateTopicFlowchart function.
 * - GenerateTopicFlowchartOutput - The return type for the generateTopicFlowchart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTopicFlowchartInputSchema = z.object({
  topic: z.string().describe('The topic to generate a flowchart for.'),
  theory: z
    .string()
    .describe('The background theory text to base the flowchart on.'),
});
export type GenerateTopicFlowchartInput = z.infer<typeof GenerateTopicFlowchartInputSchema>;

const GenerateTopicFlowchartOutputSchema = z.object({
  flowchart: z.string().describe('The generated flowchart for the topic.'),
});
export type GenerateTopicFlowchartOutput = z.infer<typeof GenerateTopicFlowchartOutputSchema>;

export async function generateTopicFlowchart(
  input: GenerateTopicFlowchartInput
): Promise<GenerateTopicFlowchartOutput> {
  return generateTopicFlowchartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTopicFlowchartPrompt',
  input: {schema: GenerateTopicFlowchartInputSchema},
  output: {schema: GenerateTopicFlowchartOutputSchema},
  prompt: `You are an expert computer science educator. Generate a text-based flowchart that illustrates the relationships between the core concepts presented in the following background theory.

The flowchart should prioritize the most important and repeated topics from the text, creating a linked-list-style structure from most to least critical.

Do not introduce any concepts not mentioned in the provided theory.

Topic: {{{topic}}}
Background Theory:
{{{theory}}}

Flowchart:`,
});

const generateTopicFlowchartFlow = ai.defineFlow(
  {
    name: 'generateTopicFlowchartFlow',
    inputSchema: GenerateTopicFlowchartInputSchema,
    outputSchema: GenerateTopicFlowchartOutputSchema,
    retries: 3,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
