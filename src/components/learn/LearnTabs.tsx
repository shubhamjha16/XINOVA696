"use client";

import { useState } from 'react';
import { TheorySection } from '@/components/learn/TheorySection';
import { FlowchartSection } from '@/components/learn/FlowchartSection';
import { QuizInitialSection } from '@/components/learn/QuizInitialSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LearnTabsProps {
  topic: string;
}

export function LearnTabs({ topic }: LearnTabsProps) {
  const [theory, setTheory] = useState<string | null>(null);
  const [flowchart, setFlowchart] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("theory");

  const handleTheoryGenerated = (generatedTheory: string) => {
    setTheory(generatedTheory);
    setActiveTab("flowchart"); 
  };

  const handleFlowchartGenerated = (generatedFlowchart: string) => {
    setFlowchart(generatedFlowchart);
    setActiveTab("quiz");
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="theory">1. Background Theory</TabsTrigger>
        <TabsTrigger value="flowchart" disabled={!theory}>2. Flowchart</TabsTrigger>
        <TabsTrigger value="quiz" disabled={!flowchart}>3. Quiz</TabsTrigger>
      </TabsList>
      <TabsContent value="theory">
        <TheorySection topic={topic} onTheoryGenerated={handleTheoryGenerated} />
      </TabsContent>
      <TabsContent value="flowchart">
        <FlowchartSection topic={topic} theory={theory} onFlowchartGenerated={handleFlowchartGenerated} />
      </TabsContent>
      <TabsContent value="quiz">
        <QuizInitialSection topic={topic} flowchart={flowchart} />
      </TabsContent>
    </Tabs>
  );
}
