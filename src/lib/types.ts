import type { GenerateTopicQuizOutput } from '@/ai/flows/generate-topic-quiz';

export type QuizQuestion = GenerateTopicQuizOutput['quiz'][0];
export type QuizData = GenerateTopicQuizOutput;
