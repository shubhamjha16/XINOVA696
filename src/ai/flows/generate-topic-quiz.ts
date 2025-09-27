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

const GenerateTopicQuizInputSchema = z.object({
  topic: z.string().describe('The computer science topic for which to generate the quiz.'),
  flowchart: z.string().describe('The text-based flowchart to base the quiz questions on.'),
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
  prompt: `You are an expert educator specializing in computer science. Your task is to generate a 15-question quiz for the given topic, based ONLY on the provided flowchart.

  The quiz must have the following structure:
  - Questions 1-10 should progress in difficulty from easy to medium to hard, testing foundational understanding and gradually increasing complexity based on the concepts and relationships in the flowchart.
  - Questions 11-15 must be proper coding-based challenges designed to assess the ability to implement and apply what has been learned in a practical context, inspired by the flowchart concepts.

  Each question must include:
  - question: The text of the quiz question.
  - options: An array of at least 4 possible answer options.
  - correctAnswerIndex: The index of the correct answer in the options array.
  - difficulty: The difficulty level of the question ('easy', 'medium', 'hard', or 'coding').
  - explanation: A detailed explanation of the correct answer.

  Topic: {{{topic}}}
  Flowchart to base the quiz on:
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
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (e) {
      console.error('Error generating topic quiz:', e);
      // Return a valid, empty QuizData object on failure to prevent crash
      return {quiz: []};
    }
  }
);
