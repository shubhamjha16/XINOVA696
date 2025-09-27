
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

export default async function LearnPage({ params }: LearnPageProps) {
  const decodedTopic = decodeURIComponent(params.topic);

  const getResultOrError = <T,>(result: PromiseSettledResult<T>): T | string => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    console.error("AI Generation Error:", result.reason);
    return result.reason instanceof Error ? result.reason.message : 'An unknown error occurred during generation.';
  }

  // Generate theory and flowchart in parallel first
  const [theoryResult, flowchartResult] = await Promise.allSettled([
    generateBackgroundTheory({ topic: decodedTopic }),
    generateTopicFlowchart({ topic: decodedTopic }),
  ]);

  const theoryData = getResultOrError(theoryResult);
  const flowchartData = getResultOrError(flowchartResult);

  let quizData: GenerateTopicQuizOutput | string;

  // If flowchart generation was successful, generate the quiz based on it
  if (typeof flowchartData !== 'string') {
    const quizResult = await Promise.allSettled([
      generateTopicQuiz({ topic: decodedTopic, flowchart: flowchartData.flowchart }),
    ]);
    quizData = getResultOrError(quizResult[0]);
  } else {
    // If flowchart failed, try to generate quiz with just the topic, or show an error
    const quizResult = await Promise.allSettled([
        generateTopicQuiz({ topic: decodedTopic, flowchart: 'Could not generate flowchart.' }),
      ]);
    quizData = getResultOrError(quizResult[0]);
    if (typeof quizData !== 'string' && quizData.quiz.length === 0) {
        quizData = 'Quiz generation failed because the flowchart could not be created.';
    }
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
