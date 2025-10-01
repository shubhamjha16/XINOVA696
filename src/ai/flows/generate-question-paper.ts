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
  prompt: `You are an expert computer science professor who specializes in creating unique and high-quality exam papers.

Your task is to generate a new question paper on a given topic. You will be provided with a flowchart for the topic and a sample question paper. You must generate a completely new and distinct paper each time this is run.

Your process must be as follows:
1.  **Analyze the Sample Paper**: Carefully examine the provided sample paper to understand its structure, the types of questions asked (definitions, comparisons, problem-solving, code), the distribution of marks (e.g., 2.5 marks, 5 marks, 10 marks), and the style of question framing.
2.  **Compare Sample to Flowchart**: Analyze if the sample paper contains important, repetitive topics from the syllabus that are missing from the provided flowchart.
    - If the sample paper is just a template for structure and doesn't introduce significant new concepts, proceed using the original flowchart for content.
    - (Self-correction Note: For this task, we will not be updating the flowchart. You must rely solely on the provided flowchart for all question content, but use the sample paper for structure and style).
3.  **Use the Flowchart for Content**: The content for the new questions MUST come exclusively from the concepts and relationships presented in the provided flowchart.
4.  **Generate New, Distinct Questions**: Create a new set of questions based on the flowchart's content. These questions must be unique for every generation.
    - **Mimic Structure**: The new paper must mimic the marking scheme, structure, and style of the sample paper.
    - **Adaptive Framing**: You must decide which concepts from the flowchart are suitable for which mark value. Rephrase questions appropriately for the marks allocated. A 2.5-mark question might ask for a definition, while a 12.5-mark question on the same topic should require in-depth analysis, comparison, or a complex problem to be solved.
    - **Do not copy questions** from the sample paper.

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
