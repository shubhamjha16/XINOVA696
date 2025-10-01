"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, Bot } from "lucide-react";
import { Button } from "../ui/button";
import type { GenerateBackgroundTheoryOutput } from "@/ai/flows/generate-background-theory";

interface TheorySectionProps {
  loading: boolean;
  error: string | null;
  data: GenerateBackgroundTheoryOutput | null;
  onGenerate: () => void;
}

export function TheorySection({ loading, error, data, onGenerate }: TheorySectionProps) {
  const renderContent = () => {
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
          <Button onClick={onGenerate} variant="secondary">Try Again</Button>
        </div>
      );
    }

    if (data?.theory) {
      return (
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap">
          {data.theory}
        </div>
      );
    }

    return (
       <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
        <p className="text-muted-foreground">Click the button to generate the background theory for this topic.</p>
        <Button onClick={onGenerate} disabled={loading}>
          <Bot className="mr-2"/>
          Generate Theory
        </Button>
      </div>
    );
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
