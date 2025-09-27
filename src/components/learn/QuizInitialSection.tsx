"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal } from "lucide-react";
import { QuizSection } from "./QuizSection";
import { Button } from "../ui/button";
import type { GenerateTopicQuizOutput } from "@/ai/flows/generate-topic-quiz";

interface QuizInitialSectionProps {
  loading: boolean;
  error: string | null;
  data: GenerateTopicQuizOutput | null;
  onRetry: () => void;
}

export function QuizInitialSection({ loading, error, data, onRetry }: QuizInitialSectionProps) {

  const renderContent = () => {
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
           <Button onClick={onRetry} variant="secondary">Try Again</Button>
        </div>
      );
    }

    if (data) {
      return <QuizSection quizData={data} />;
    }
    
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
          <p className="text-muted-foreground">Quiz could not be generated.</p>
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
