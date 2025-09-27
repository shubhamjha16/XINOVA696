// Use server directive.
'use server';

/**
 * @fileOverview Generates a flowchart for a given topic.
 *
 * - generateTopicFlowchart - A function that generates a flowchart for a given topic.
 * - GenerateTopicFlowchartInput - The input type for the generateTopicFlowchart function.
 * - GenerateTopicFlowchartOutput - The return type for the generateTopicFlowchart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTopicFlowchartInputSchema = z.object({
  topic: z.string().describe('The topic to generate a flowchart for.'),
});
export type GenerateTopicFlowchartInput = z.infer<typeof GenerateTopicFlowchartInputSchema>;

const GenerateTopicFlowchartOutputSchema = z.object({
  flowchart: z.string().describe('The generated flowchart for the topic.'),
});
export type GenerateTopicFlowchartOutput = z.infer<typeof GenerateTopicFlowchartOutputSchema>;

export async function generateTopicFlowchart(input: GenerateTopicFlowchartInput): Promise<GenerateTopicFlowchartOutput> {
  return generateTopicFlowchartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTopicFlowchartPrompt',
  input: {schema: GenerateTopicFlowchartInputSchema},
  output: {schema: GenerateTopicFlowchartOutputSchema},
  prompt: `You are an expert computer science educator. Generate a text-based flowchart that illustrates the relationships between core concepts related to the following topic: {{{topic}}}. The flowchart should be easy to understand and should provide a high-level overview of the topic. Focus on the key concepts and their relationships, rather than providing detailed explanations.`,
});

const generateTopicFlowchartFlow = ai.defineFlow(
  {
    name: 'generateTopicFlowchartFlow',
    inputSchema: GenerateTopicFlowchartInputSchema,
    outputSchema: GenerateTopicFlowchartOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
