"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, Bot } from "lucide-react";
import { QuizSection } from "./QuizSection";
import { Button } from "../ui/button";
import type { GenerateTopicQuizOutput } from "@/ai/flows/generate-topic-quiz";

interface QuizInitialSectionProps {
  loading: boolean;
  error: string | null;
  data: GenerateTopicQuizOutput | null;
  onGenerate: () => void;
  hasPrereqs: boolean;
}

export function QuizInitialSection({ loading, error, data, onGenerate, hasPrereqs }: QuizInitialSectionProps) {

  const renderContent = () => {
    if (!hasPrereqs) {
      return (
         <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
            <p className="text-muted-foreground">Please generate the flowchart first.</p>
        </div>
      );
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
           <Button onClick={onGenerate} variant="secondary">Try Again</Button>
        </div>
      );
    }

    if (data) {
      return <QuizSection quizData={data} />;
    }
    
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
          <p className="text-muted-foreground">Click the button to start a quiz based on the flowchart.</p>
          <Button onClick={onGenerate} disabled={loading}>
            <Bot className="mr-2" />
            Start Quiz
          </Button>
        </div>
    );
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
