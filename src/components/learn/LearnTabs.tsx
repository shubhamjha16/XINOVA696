"use client";

import { useState } from 'react';
import { TheorySection } from '@/components/learn/TheorySection';
import { FlowchartSection } from '@/components/learn/FlowchartSection';
import { QuizInitialSection } from '@/components/learn/QuizInitialSection';
import { PaperGeneratorSection } from '@/components/learn/PaperGeneratorSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateBackgroundTheory, type GenerateBackgroundTheoryOutput } from '@/ai/flows/generate-background-theory';
import { generateTopicFlowchart, type GenerateTopicFlowchartOutput } from '@/ai/flows/generate-topic-flowchart';
import { generateTopicQuiz, type GenerateTopicQuizOutput } from '@/ai/flows/generate-topic-quiz';

interface LearnTabsProps {
  topic: string;
}

type Data<T> = {
  loading: boolean;
  error: string | null;
  data: T | null;
}

export function LearnTabs({ topic }: LearnTabsProps) {
  const [activeTab, setActiveTab] = useState("theory");
  
  const [theoryState, setTheoryState] = useState<Data<GenerateBackgroundTheoryOutput>>({ loading: false, error: null, data: null });
  const [flowchartState, setFlowchartState] = useState<Data<GenerateTopicFlowchartOutput>>({ loading: false, error: null, data: null });
  const [quizState, setQuizState] = useState<Data<GenerateTopicQuizOutput>>({ loading: false, error: null, data: null });

  const handleGenerateTheory = async () => {
    setTheoryState({ loading: true, error: null, data: null });
    setFlowchartState({ loading: false, error: null, data: null });
    setQuizState({ loading: false, error: null, data: null });
    setActiveTab("theory");
    try {
      const data = await generateBackgroundTheory({ topic });
      setTheoryState({ loading: false, error: null, data });
    } catch (e) {
      const error = e instanceof Error ? e.message : "An unknown error occurred.";
      setTheoryState({ loading: false, error, data: null });
    }
  };

  const handleGenerateFlowchart = async () => {
    if (!theoryState.data) return;
    setFlowchartState({ loading: true, error: null, data: null });
    setQuizState({ loading: false, error: null, data: null });
    setActiveTab("flowchart");
    try {
      const data = await generateTopicFlowchart({ topic, theory: theoryState.data.theory });
      setFlowchartState({ loading: false, error: null, data });
    } catch (e) {
      const error = e instanceof Error ? e.message : "An unknown error occurred.";
      setFlowchartState({ loading: false, error, data: null });
    }
  };
  
  const handleGenerateQuiz = async () => {
    if (!flowchartState.data) return;
    setQuizState({ loading: true, error: null, data: null });
    setActiveTab("quiz");
    try {
      const data = await generateTopicQuiz({ topic, flowchart: flowchartState.data.flowchart });
      setQuizState({ loading: false, error: null, data });
    } catch (e) {
      const error = e instanceof Error ? e.message : "An unknown error occurred.";
      setQuizState({ loading: false, error, data: null });
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="theory">1. Background Theory</TabsTrigger>
        <TabsTrigger value="flowchart" disabled={!theoryState.data}>2. Flowchart</TabsTrigger>
        <TabsTrigger value="quiz" disabled={!flowchartState.data}>3. Quiz</TabsTrigger>
        <TabsTrigger value="paper" disabled={!flowchartState.data}>4. Paper Generator</TabsTrigger>
      </TabsList>
      <TabsContent value="theory">
        <TheorySection 
          {...theoryState} 
          onGenerate={handleGenerateTheory}
        />
      </TabsContent>
      <TabsContent value="flowchart">
        <FlowchartSection 
          {...flowchartState} 
          onGenerate={handleGenerateFlowchart}
          hasPrereqs={!!theoryState.data}
        />
      </TabsContent>
      <TabsContent value="quiz">
        <QuizInitialSection 
          {...quizState} 
          onGenerate={handleGenerateQuiz}
          hasPrereqs={!!flowchartState.data}
        />
      </TabsContent>
       <TabsContent value="paper">
        <PaperGeneratorSection 
          topic={topic}
          flowchart={flowchartState.data?.flowchart ?? null}
          hasPrereqs={!!flowchartState.data}
        />
      </TabsContent>
    </Tabs>
  );
}
