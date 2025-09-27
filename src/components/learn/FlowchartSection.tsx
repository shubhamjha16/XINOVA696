
"use client";

import { useEffect, useState } from "react";
import { generateBackgroundTheory } from "@/ai/flows/generate-background-theory";
import { generateTopicFlowchart } from "@/ai/flows/generate-topic-flowchart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal } from "lucide-react";

interface FlowchartSectionProps {
  topic: string;
}

export function FlowchartSection({ topic }: FlowchartSectionProps) {
  const [flowchart, setFlowchart] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlowchart() {
      try {
        setLoading(true);
        setError(null);
        // First get theory, then get flowchart
        const theoryResult = await generateBackgroundTheory({ topic });
        const flowchartResult = await generateTopicFlowchart({
          topic,
          theory: theoryResult.theory,
        });
        setFlowchart(flowchartResult.flowchart);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(`Failed to generate flowchart: ${errorMessage}`);
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchFlowchart();
  }, [topic]);

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
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Generation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
