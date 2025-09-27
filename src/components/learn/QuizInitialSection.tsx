
"use client";

import { useEffect, useState } from "react";
import { generateBackgroundTheory } from "@/ai/flows/generate-background-theory";
import { generateTopicFlowchart } from "@/ai/flows/generate-topic-flowchart";
import { generateTopicQuiz, type GenerateTopicQuizOutput } from "@/ai/flows/generate-topic-quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal } from "lucide-react";
import { QuizSection } from "./QuizSection";
import { Button } from "../ui/button";

interface QuizInitialSectionProps {
  topic: string;
}

export function QuizInitialSection({ topic }: QuizInitialSectionProps) {
  const [quizData, setQuizData] = useState<GenerateTopicQuizOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  async function fetchQuiz() {
    try {
      setLoading(true);
      setError(null);
      setQuizData(null);
      
      const theoryResult = await generateBackgroundTheory({ topic });
      const flowchartResult = await generateTopicFlowchart({
        topic,
        theory: theoryResult.theory,
      });
      const quizResult = await generateTopicQuiz({
        topic,
        flowchart: flowchartResult.flowchart,
      });
      setQuizData(quizResult);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate quiz: ${errorMessage}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleStart = () => {
    setStarted(true);
    fetchQuiz();
  }
  
  const handleRetry = () => {
    fetchQuiz();
  }

  if (!started) {
     return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="font-headline">Quiz</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
                <p>Ready to test your knowledge?</p>
                <Button onClick={handleStart} size="lg">Start Quiz</Button>
            </CardContent>
        </Card>
     )
  }

  if (loading) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="font-headline">Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="font-headline">Quiz</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Generation Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
           <Button onClick={handleRetry} variant="secondary">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (quizData) {
    return <QuizSection quizData={quizData} />;
  }

  return null;
}
