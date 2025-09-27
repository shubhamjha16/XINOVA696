'use server';
/**
 * @fileOverview Generates a 15-question quiz tailored to a given topic, with difficulty progressing from easy to challenging coding questions.
 *
 * - generateProgressiveQuiz - A function that generates the quiz.
 * - GenerateProgressiveQuizInput - The input type for the generateProgressiveQuiz function.
 * - GenerateProgressiveQuizOutput - The return type for the generateProgressiveQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProgressiveQuizInputSchema = z.object({
  topic: z.string().describe('The computer science topic for which to generate the quiz.'),
});
export type GenerateProgressiveQuizInput = z.infer<typeof GenerateProgressiveQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  answer: z.string().describe('The correct answer to the quiz question.'),
  explanation: z.string().describe('Detailed explanation for the answer.'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'coding']).describe('The difficulty level of the question.'),
});

const GenerateProgressiveQuizOutputSchema = z.object({
  quiz: z.array(QuizQuestionSchema).describe('An array of 15 quiz questions with progressive difficulty.'),
});
export type GenerateProgressiveQuizOutput = z.infer<typeof GenerateProgressiveQuizOutputSchema>;

export async function generateProgressiveQuiz(input: GenerateProgressiveQuizInput): Promise<GenerateProgressiveQuizOutput> {
  return generateProgressiveQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProgressiveQuizPrompt',
  input: {schema: GenerateProgressiveQuizInputSchema},
  output: {schema: GenerateProgressiveQuizOutputSchema},
  prompt: `You are an expert computer science educator. Generate a 15-question quiz on the topic of {{{topic}}}.

The quiz should progress in difficulty:
- Questions 1-5: Easy, testing foundational understanding.
- Questions 6-10: Medium, building on foundational knowledge.
- Questions 11-15: Hard, coding-based challenges assessing practical application.

Each question should include the question itself, the correct answer, a detailed explanation, and a difficulty level (easy, medium, hard, coding).

Output the quiz in JSON format. Example:
{
  "quiz": [
    {
      "question": "What is the time complexity of a binary search tree?",
      "answer": "O(log n)",
      "explanation": "Binary search trees have a time complexity of O(log n) for search, insert, and delete operations, on average.",
      "difficulty": "medium"
    },
   {
      "question": "Write a function to reverse a linked list.",
      "answer": "function reverseLinkedList(head) { ... }",
      "explanation": "Iterate through the linked list, changing the next pointer of each node to point to the previous node.",
      "difficulty": "coding"
    },
    ...
  ]
}
`,
});

const generateProgressiveQuizFlow = ai.defineFlow(
  {
    name: 'generateProgressiveQuizFlow',
    inputSchema: GenerateProgressiveQuizInputSchema,
    outputSchema: GenerateProgressiveQuizOutputSchema,
    retries: 3,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
