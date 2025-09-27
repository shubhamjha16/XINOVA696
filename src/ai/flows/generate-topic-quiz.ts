'use server';

/**
 * @fileOverview A quiz generation AI agent for a given topic.
 *
 * - generateTopicQuiz - A function that handles the quiz generation process.
 * - GenerateTopicQuizInput - The input type for the generateTopicQuiz function.
 * - GenerateTopicQuizOutput - The return type for the generateTopicQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTopicQuizInputSchema = z.string().describe('The topic for which to generate a quiz.');
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

export async function generateTopicQuiz(topic: GenerateTopicQuizInput): Promise<GenerateTopicQuizOutput> {
  return generateTopicQuizFlow(topic);
}

const prompt = ai.definePrompt({
  name: 'generateTopicQuizPrompt',
  input: {schema: GenerateTopicQuizInputSchema},
  output: {schema: GenerateTopicQuizOutputSchema},
  prompt: `You are an expert educator specializing in computer science. Your task is to generate a 15-question quiz for the given topic.

  The quiz should have the following structure:
  - Questions 1-10 should progress in difficulty from easy to medium to hard, testing foundational understanding and gradually increasing complexity.
  - Questions 11-15 should be coding-based challenges designed to assess the ability to implement and apply what has been learned in a practical context.

  Each question should include:
  - question: The text of the quiz question.
  - options: An array of possible answer options (at least 4 options).
  - correctAnswerIndex: The index of the correct answer in the options array.
  - difficulty: The difficulty level of the question (easy, medium, hard, or coding).
  - explanation: A detailed explanation of the correct answer.

  Topic: {{{topic}}}

  Ensure the quiz is comprehensive, covering the key concepts of the topic, and that the questions are well-written and engaging.
  Output the quiz as a JSON object.
  `,
});

const generateTopicQuizFlow = ai.defineFlow(
  {
    name: 'generateTopicQuizFlow',
    inputSchema: GenerateTopicQuizInputSchema,
    outputSchema: GenerateTopicQuizOutputSchema,
  },
  async topic => {
    const {output} = await prompt(topic);
    return output!;
  }
);
