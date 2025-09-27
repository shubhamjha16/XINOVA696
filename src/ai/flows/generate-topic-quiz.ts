'use server';

/**
 * @fileOverview A quiz generation AI agent for a given topic, based on a provided flowchart.
 *
 * - generateTopicQuiz - A function that handles the quiz generation process.
 * - GenerateTopicQuizInput - The input type for the generateTopicQuiz function.
 * - GenerateTopicQuizOutput - The return type for the generateTopicQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateTopicFlowchart } from './generate-topic-flowchart';

const GenerateTopicQuizInputSchema = z.object({
  topic: z.string().describe('The computer science topic for which to generate the quiz.'),
  flowchart: z.string().describe('The text-based flowchart to base the quiz questions on. If N/A, a flowchart will be generated.'),
});
export type GenerateTopicQuizInput = z.infer<typeof GenerateTopicQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The text of the quiz question.'),
  options: z.array(z.string()).describe('The possible answer options for the question.'),
  correctAnswerIndex: z.number().describe('The index of the correct answer in the options array.'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'coding']).describe('The difficulty level of the question.'),
  explanation: z.string().describe('Explanation of the correct answer.'),
});

const GenerateTopicQuizOutputSchema = z.object({
  quiz: z.array(QuizQuestionSchema).describe('An array of quiz questions.'),
});
export type GenerateTopicQuizOutput = z.infer<typeof GenerateTopicQuizOutputSchema>;

export async function generateTopicQuiz(input: GenerateTopicQuizInput): Promise<GenerateTopicQuizOutput> {
  return generateTopicQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTopicQuizPrompt',
  input: {schema: GenerateTopicQuizInputSchema},
  output: {schema: GenerateTopicQuizOutputSchema},
  prompt: `You are an expert educator specializing in computer science. Your task is to generate a 15-question quiz for the given topic, based on the provided flowchart.

  The quiz should have the following structure:
  - Questions 1-10 should progress in difficulty from easy to medium to hard, testing foundational understanding and gradually increasing complexity based on the flowchart.
  - Questions 11-15 should be coding-based challenges designed to assess the ability to implement and apply what has been learned in a practical context, inspired by the flowchart concepts.

  Each question should include:
  - question: The text of the quiz question.
  - options: An array of possible answer options (at least 4 options).
  - correctAnswerIndex: The index of the correct answer in the options array.
  - difficulty: The difficulty level of the question (easy, medium, hard, or coding).
  - explanation: A detailed explanation of the correct answer.

  Topic: {{{topic}}}
  Flowchart:
  {{{flowchart}}}

  Ensure the quiz is comprehensive, covering the key concepts of the topic as laid out in the flowchart, and that the questions are well-written and engaging.
  Output the quiz as a JSON object.
  `,
});

const generateTopicQuizFlow = ai.defineFlow(
  {
    name: 'generateTopicQuizFlow',
    inputSchema: GenerateTopicQuizInputSchema,
    outputSchema: GenerateTopicQuizOutputSchema,
    retries: 3,
  },
  async (input) => {
    let flowchart = input.flowchart;
    
    // If no flowchart is provided, generate one.
    if (flowchart === 'N/A') {
      try {
        const flowchartResponse = await generateTopicFlowchart({ topic: input.topic });
        flowchart = flowchartResponse.flowchart;
      } catch (e) {
        console.error('Error generating flowchart within quiz flow:', e);
        // If flowchart generation fails, we'll proceed with a placeholder.
        // The prompt is robust enough to handle a less-than-ideal flowchart.
        flowchart = `Could not generate a flowchart for ${input.topic}. Please generate a general quiz.`;
      }
    }

    try {
      const {output} = await prompt({ topic: input.topic, flowchart });
      return output!;
    } catch (e) {
      console.error('Error generating topic quiz:', e);
      // Return a valid, empty QuizData object on failure to prevent crash
      return { quiz: [] };
    }
  }
);
