"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal } from "lucide-react";
import { Button } from "../ui/button";
import type { GenerateTopicFlowchartOutput } from "@/ai/flows/generate-topic-flowchart";

interface FlowchartSectionProps {
  loading: boolean;
  error: string | null;
  data: GenerateTopicFlowchartOutput | null;
  onRetry: () => void;
}

export function FlowchartSection({ loading, error, data, onRetry }: FlowchartSectionProps) {
  const renderContent = () => {
    if (loading) {
      return (
         <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
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
    
    if (data?.flowchart) {
      return (
         <div className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
          <pre className="font-code text-sm text-foreground">
            <code>
              {data.flowchart}
            </code>
          </pre>
        </div>
      )
    }

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
          <p className="text-muted-foreground">Flowchart could not be generated.</p>
        </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="font-headline">Conceptual Flowchart</CardTitle>
      </CardHeader>
      <CardContent>
       {renderContent()}
      </CardContent>
    </Card>
  );
}
