"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { TheorySection } from "./TheorySection";
import { FlowchartSection } from "./FlowchartSection";
import { QuizSection } from "./QuizSection";
import type { QuizData } from "@/lib/types";

interface LearnClientProps {
  theory: string;
  flowchart: string;
  quizData: QuizData;
  quizError?: string;
}

export function LearnClient({ theory, flowchart, quizData, quizError }: LearnClientProps) {
  return (
    <Tabs defaultValue="theory" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="theory">Background Theory</TabsTrigger>
        <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
      </TabsList>
      <Card className="mt-4">
        <TabsContent value="theory">
            <TheorySection theory={theory} />
        </TabsContent>
        <TabsContent value="flowchart">
            <FlowchartSection flowchart={flowchart} />
        </TabsContent>
        <TabsContent value="quiz">
            <QuizSection quizData={quizData} error={quizError} />
        </TabsContent>
      </Card>
    </Tabs>
  );
}
