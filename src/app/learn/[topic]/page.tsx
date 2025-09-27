
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

  // Generate theory first, as it's needed by the flowchart
  const theoryResult = await safeGenerate(generateBackgroundTheory({ topic: decodedTopic }));
  const theory = typeof theoryResult !== 'string' ? theoryResult.theory : `Error generating theory: ${theoryResult}`;

  // Run flowchart and quiz generation in parallel
  const [flowchartResult, quizResult] = await Promise.all([
    safeGenerate(
      generateTopicFlowchart({
        topic: decodedTopic,
        theory: typeof theoryResult !== 'string' ? theoryResult.theory : 'No theory available.',
      })
    ),
    safeGenerate(
      generateTopicQuiz({
        topic: decodedTopic,
        // The quiz will be generated based on the flowchart, which we will get from the result of the other promise.
        // For now, we pass a placeholder. This dependency is handled below.
        flowchart: 'No flowchart available.',
      })
    ),
  ]);

  const flowchart = typeof flowchartResult !== 'string' ? flowchartResult.flowchart : `Error generating flowchart: ${flowchartResult}`;
  
  // Now, if the flowchart is available, we can pass it to the quiz generation.
  // This is a bit of a logical leap for the static analysis, but in a real app,
  // we would regenerate the quiz if the flowchart was successfully created.
  // For this simplified model, we will proceed with the quiz generated without the flowchart if it failed.
  const finalQuizResult = typeof flowchartResult !== 'string' 
    ? await safeGenerate(generateTopicQuiz({ topic: decodedTopic, flowchart: flowchartResult.flowchart }))
    : quizResult;

  const quizData = typeof finalQuizResult !== 'string' ? finalQuizResult : { quiz: [] };
  const quizError = typeof finalQuizResult === 'string' ? `Error generating quiz: ${finalQuizResult}` : undefined;


  // Check if all generations failed to show a top-level error
  const allFailed = [theoryResult, flowchartResult, finalQuizResult].every(result => typeof result === 'string');
  
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
        theory={theory}
        flowchart={flowchart}
        quizData={quizData}
        quizError={quizError}
      />
    </div>
  );
}

