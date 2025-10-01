'use server';

/**
 * @fileOverview Generates a question paper based on a topic, flowchart, and a sample paper.
 *
 * - generateQuestionPaper - A function that generates the question paper.
 * - GenerateQuestionPaperInput - The input type for the generateQuestionPaper function.
 * - GenerateQuestionPaperOutput - The return type for the generateQuestionPaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestionPaperInputSchema = z.object({
  topic: z.string().describe('The computer science topic for the question paper.'),
  flowchart: z.string().describe('The text-based flowchart of the topic.'),
  samplePaper: z.string().describe('The text of a sample question paper to use as a style and structure reference.'),
});
export type GenerateQuestionPaperInput = z.infer<typeof GenerateQuestionPaperInputSchema>;

const PaperQuestionSchema = z.object({
    questionText: z.string().describe('The full text of the question.'),
    marks: z.number().describe('The number of marks allocated to this question.'),
});

const GenerateQuestionPaperOutputSchema = z.object({
  questions: z.array(PaperQuestionSchema).describe('An array of questions for the generated paper.'),
});
export type GenerateQuestionPaperOutput = z.infer<typeof GenerateQuestionPaperOutputSchema>;

export async function generateQuestionPaper(
  input: GenerateQuestionPaperInput
): Promise<GenerateQuestionPaperOutput> {
  return generateQuestionPaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuestionPaperPrompt',
  input: {schema: GenerateQuestionPaperInputSchema},
  output: {schema: GenerateQuestionPaperOutputSchema},
  prompt: `You are an expert computer science professor who specializes in creating exam papers.

Your task is to generate a new question paper on a given topic. You will be provided with a flowchart for the topic and a sample question paper.

Your process must be as follows:
1.  **Analyze the Sample Paper**: Carefully examine the provided sample paper to understand its structure, the types of questions asked, the distribution of marks (e.g., 2.5 marks, 5 marks, 10 marks), and the style of question framing.
2.  **Use the Flowchart for Content**: The content for the new questions MUST come exclusively from the concepts and relationships presented in the provided flowchart.
3.  **Generate New Questions**: Create a new set of questions based on the flowchart's content. These new questions must mimic the marking scheme, structure, and style of the sample paper. You must decide which concepts from the flowchart are suitable for which mark value based on the patterns in the sample paper.

Do not copy questions from the sample paper. Generate a completely new paper.

Topic: {{{topic}}}

Flowchart (Content Source):
{{{flowchart}}}

Sample Paper (Style and Structure Reference):
{{{samplePaper}}}

Generated Question Paper:`,
});

const generateQuestionPaperFlow = ai.defineFlow(
  {
    name: 'generateQuestionPaperFlow',
    inputSchema: GenerateQuestionPaperInputSchema,
    outputSchema: GenerateQuestionPaperOutputSchema,
    retries: 3,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
