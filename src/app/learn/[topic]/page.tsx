
import { generateBackgroundTheory } from '@/ai/flows/generate-background-theory';
import { generateTopicFlowchart } from '@/ai/flows/generate-topic-flowchart';
import { generateTopicQuiz, GenerateTopicQuizOutput } from '@/ai/flows/generate-topic-quiz';
import { LearnClient } from '@/components/learn/LearnClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

type LearnPageProps = {
  params: {
    topic: string;
  };
};

// Helper to safely execute an AI generation function and return either the result or an error string
async function safeGenerate<T>(promise: Promise<T>): Promise<T | string> {
  try {
    return await promise;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return error instanceof Error ? error.message : 'An unknown error occurred during generation.';
  }
}

export default async function LearnPage({ params }: LearnPageProps) {
  const decodedTopic = decodeURIComponent(params.topic);

  // Generate content serially to enforce dependencies
  const theoryData = await safeGenerate(generateBackgroundTheory({ topic: decodedTopic }));
  
  const flowchartData = await safeGenerate(generateTopicFlowchart({ topic: decodedTopic }));
  
  const flowchartForQuiz = typeof flowchartData !== 'string' ? flowchartData.flowchart : "N/A";
  const quizData = await safeGenerate(generateTopicQuiz({ topic: decodedTopic, flowchart: flowchartForQuiz }));

  // Check if all generations failed to show a top-level error
  const allFailed = [theoryData, flowchartData, quizData].every(data => typeof data === 'string');
  
  if (allFailed) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Generation Failed</AlertTitle>
        <AlertDescription>
          There was a critical error generating the learning materials for "{decodedTopic}". All generation attempts failed. Please try a different topic or try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter text-center mb-8">
        Learn: <span className="text-primary">{decodedTopic}</span>
      </h1>
      <LearnClient
        theory={typeof theoryData !== 'string' ? theoryData.theory : `Error generating theory: ${theoryData}`}
        flowchart={typeof flowchartData !== 'string' ? flowchartData.flowchart : `Error generating flowchart: ${flowchartData}`}
        quizData={typeof quizData !== 'string' ? quizData : { quiz: [] }}
        quizError={typeof quizData === 'string' ? `Error generating quiz: ${quizData}` : undefined}
      />
    </div>
  );
}
