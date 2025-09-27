
"use client";

import { useState } from 'react';
import { TheorySection } from '@/components/learn/TheorySection';
import { FlowchartSection } from '@/components/learn/FlowchartSection';
import { QuizInitialSection } from '@/components/learn/QuizInitialSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LearnPageProps = {
  params: {
    topic: string;
  };
};

export default function LearnPage({ params }: LearnPageProps) {
  const decodedTopic = decodeURIComponent(params.topic);
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
    <div className="w-full">
      <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter text-center mb-8">
        Learn: <span className="text-primary">{decodedTopic}</span>
      </h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="theory">1. Background Theory</TabsTrigger>
          <TabsTrigger value="flowchart" disabled={!theory}>2. Flowchart</TabsTrigger>
          <TabsTrigger value="quiz" disabled={!flowchart}>3. Quiz</TabsTrigger>
        </TabsList>
        <TabsContent value="theory">
          <TheorySection topic={decodedTopic} onTheoryGenerated={handleTheoryGenerated} />
        </TabsContent>
        <TabsContent value="flowchart">
          <FlowchartSection topic={decodedTopic} theory={theory} onFlowchartGenerated={handleFlowchartGenerated} />
        </TabsContent>
        <TabsContent value="quiz">
          <QuizInitialSection topic={decodedTopic} flowchart={flowchart} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
