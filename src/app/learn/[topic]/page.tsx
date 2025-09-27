
import { generateBackgroundTheory } from '@/ai/flows/generate-background-theory';
import { generateTopicFlowchart } from '@/ai/flows/generate-topic-flowchart';
import { generateTopicQuiz } from '@/ai/flows/generate-topic-quiz';
import { LearnClient } from '@/components/learn/LearnClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

type LearnPageProps = {
  params: {
    topic: string;
  };
};

export default async function LearnPage({ params }: LearnPageProps) {
  const decodedTopic = decodeURIComponent(params.topic);

  let theoryData: Awaited<ReturnType<typeof generateBackgroundTheory>> | string;
  let flowchartData: Awaited<ReturnType<typeof generateTopicFlowchart>> | string;
  let quizData: Awaited<ReturnType<typeof generateTopicQuiz>> | string;

  try {
    const [theoryResult, flowchartResult, quizResult] = await Promise.allSettled([
      generateBackgroundTheory({ topic: decodedTopic }),
      generateTopicFlowchart({ topic: decodedTopic }),
      generateTopicQuiz(decodedTopic),
    ]);

    const getResultOrError = <T,>(result: PromiseSettledResult<T>): T | string => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      console.error("AI Generation Error:", result.reason);
      return result.reason instanceof Error ? result.reason.message : 'An unknown error occurred during generation.';
    }

    theoryData = getResultOrError(theoryResult);
    flowchartData = getResultOrError(flowchartResult);
    quizData = getResultOrError(quizResult);

  } catch (error) {
    console.error("Critical Error during AI Generation:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    theoryData = `Failed to generate: ${errorMessage}`;
    flowchartData = `Failed to generate: ${errorMessage}`;
    quizData = `Failed to generate: ${errorMessage}`;
  }


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
