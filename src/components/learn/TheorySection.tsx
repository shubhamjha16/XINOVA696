
"use client";

import { useState } from "react";
import { generateBackgroundTheory } from "@/ai/flows/generate-background-theory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal } from "lucide-react";
import { Button } from "../ui/button";

interface TheorySectionProps {
  topic: string;
  onTheoryGenerated: (theory: string) => void;
}

export function TheorySection({ topic, onTheoryGenerated }: TheorySectionProps) {
  const [theory, setTheory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  async function fetchTheory() {
    try {
      setLoading(true);
      setError(null);
      const result = await generateBackgroundTheory({ topic });
      setTheory(result.theory);
      onTheoryGenerated(result.theory);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate background theory: ${errorMessage}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleStart = () => {
    setStarted(true);
    fetchTheory();
  }

  const handleRetry = () => {
    fetchTheory();
  }

  const renderContent = () => {
    if (!started) {
      return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
            <p>Start by generating the background theory for your topic.</p>
            <Button onClick={handleStart} size="lg">Generate Theory</Button>
        </div>
      )
    }

    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
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

    if (theory) {
      return (
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap">
          {theory}
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="font-headline">Background Theory</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
