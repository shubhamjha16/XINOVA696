
"use client";

import { useState } from "react";
import { generateTopicFlowchart } from "@/ai/flows/generate-topic-flowchart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, Lock } from "lucide-react";
import { Button } from "../ui/button";

interface FlowchartSectionProps {
  topic: string;
  theory: string | null;
  onFlowchartGenerated: (flowchart: string) => void;
}

export function FlowchartSection({ topic, theory, onFlowchartGenerated }: FlowchartSectionProps) {
  const [flowchart, setFlowchart] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  async function fetchFlowchart() {
    if (!theory) {
      setError("Background theory must be generated before creating a flowchart.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const flowchartResult = await generateTopicFlowchart({
        topic,
        theory: theory,
      });
      setFlowchart(flowchartResult.flowchart);
      onFlowchartGenerated(flowchartResult.flowchart);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate flowchart: ${errorMessage}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  
  const handleStart = () => {
    setStarted(true);
    fetchFlowchart();
  }

  const handleRetry = () => {
    fetchFlowchart();
  }

  const renderContent = () => {
    if (!theory) {
      return (
         <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
            <Lock className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Please generate the background theory first.</p>
        </div>
      )
    }
    
    if (!started) {
      return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
            <p>Now, let's create a conceptual flowchart based on the theory.</p>
            <Button onClick={handleStart} size="lg">Generate Flowchart</Button>
        </div>
      )
    }

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
           <Button onClick={handleRetry} variant="secondary">Try Again</Button>
        </div>
      );
    }
    
    if (flowchart) {
      return (
         <div className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
          <pre className="font-code text-sm text-foreground">
            <code>
              {flowchart}
            </code>
          </pre>
        </div>
      )
    }

    return null;
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
