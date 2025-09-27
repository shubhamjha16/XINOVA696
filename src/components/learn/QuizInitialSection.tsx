
"use client";

import { useState } from "react";
import { generateTopicQuiz, type GenerateTopicQuizOutput } from "@/ai/flows/generate-topic-quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, Lock } from "lucide-react";
import { QuizSection } from "./QuizSection";
import { Button } from "../ui/button";

interface QuizInitialSectionProps {
  topic: string;
  flowchart: string | null;
}

export function QuizInitialSection({ topic, flowchart }: QuizInitialSectionProps) {
  const [quizData, setQuizData] = useState<GenerateTopicQuizOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  async function fetchQuiz() {
    if (!flowchart) {
      setError("A flowchart must be generated before creating a quiz.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setQuizData(null);
      
      const quizResult = await generateTopicQuiz({
        topic,
        flowchart: flowchart,
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

  const renderContent = () => {
     if (!flowchart) {
      return (
         <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
            <Lock className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Please generate the flowchart first.</p>
        </div>
      )
    }

    if (!started) {
      return (
          <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
              <p>Ready to test your knowledge?</p>
              <Button onClick={handleStart} size="lg">Start Quiz</Button>
          </div>
      )
    }

    if (loading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Generation Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
           <Button onClick={handleRetry} variant="secondary">Try Again</Button>
        </div>
      );
    }

    if (quizData) {
      return <QuizSection quizData={quizData} />;
    }
    
    return null;
  }
  
  return (
      <Card className="mt-4">
          <CardHeader>
              <CardTitle className="font-headline">Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
      </Card>
  )
}
