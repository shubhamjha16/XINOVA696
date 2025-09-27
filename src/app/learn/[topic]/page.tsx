
"use client";

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

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter text-center mb-8">
        Learn: <span className="text-primary">{decodedTopic}</span>
      </h1>
      <Tabs defaultValue="theory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="theory">Background Theory</TabsTrigger>
          <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>
        <TabsContent value="theory">
          <TheorySection topic={decodedTopic} />
        </TabsContent>
        <TabsContent value="flowchart">
          <FlowchartSection topic={decodedTopic} />
        </TabsContent>
        <TabsContent value="quiz">
          <QuizInitialSection topic={decodedTopic} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
