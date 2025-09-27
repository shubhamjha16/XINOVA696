"use client";

import { useState, useEffect } from 'react';
import { TheorySection } from '@/components/learn/TheorySection';
import { FlowchartSection } from '@/components/learn/FlowchartSection';
import { QuizInitialSection } from '@/components/learn/QuizInitialSection';
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
  const [theory, setTheory] = useState<Data<GenerateBackgroundTheoryOutput>>({ loading: true, error: null, data: null });
  const [flowchart, setFlowchart] = useState<Data<GenerateTopicFlowchartOutput>>({ loading: true, error: null, data: null });
  const [quiz, setQuiz] = useState<Data<GenerateTopicQuizOutput>>({ loading: true, error: null, data: null });

  useEffect(() => {
    async function fetchData() {
      // Set all to loading
      setTheory({ loading: true, error: null, data: null });
      setFlowchart({ loading: true, error: null, data: null });
      setQuiz({ loading: true, error: null, data: null });

      // --- Theory Generation ---
      const theoryPromise = generateBackgroundTheory({ topic })
        .then(data => {
          setTheory({ loading: false, error: null, data });
          return data;
        })
        .catch(e => {
          const error = e instanceof Error ? e.message : "An unknown error occurred.";
          setTheory({ loading: false, error, data: null });
          return null;
        });

      // --- Flowchart Generation (depends on Theory) ---
      const flowchartPromise = theoryPromise.then(theoryResult => {
        if (!theoryResult) {
          const error = "Flowchart generation skipped: background theory failed.";
          setFlowchart({ loading: false, error, data: null });
          return null;
        }
        return generateTopicFlowchart({ topic, theory: theoryResult.theory })
          .then(data => {
            setFlowchart({ loading: false, error: null, data });
            return data;
          })
          .catch(e => {
            const error = e instanceof Error ? e.message : "An unknown error occurred.";
            setFlowchart({ loading: false, error, data: null });
            return null;
          });
      });

      // --- Quiz Generation (depends on Flowchart) ---
      flowchartPromise.then(flowchartResult => {
         // Fallback strategy
        const flowchartContent = flowchartResult?.flowchart;
        if (!flowchartContent) {
           const error = "Quiz generation will be based on the topic directly as flowchart generation failed.";
           console.warn(error);
           // NOTE: We could set an error state here, but we will proceed with a fallback.
        }
        
        return generateTopicQuiz({ topic, flowchart: flowchartContent ?? "" })
          .then(data => {
            setQuiz({ loading: false, error: null, data });
          })
          .catch(e => {
            const error = e instanceof Error ? e.message : "An unknown error occurred.";
            setQuiz({ loading: false, error, data: null });
          });
      });
    }

    fetchData();
  }, [topic]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="theory">1. Background Theory</TabsTrigger>
        <TabsTrigger value="flowchart" disabled={theory.loading || !!theory.error}>2. Flowchart</TabsTrigger>
        <TabsTrigger value="quiz" disabled={flowchart.loading || !!flowchart.error}>3. Quiz</TabsTrigger>
      </TabsList>
      <TabsContent value="theory">
        <TheorySection {...theory} onRetry={() => setTheory({ ...theory, loading: true, error: null })}/>
      </TabsContent>
      <TabsContent value="flowchart">
        <FlowchartSection {...flowchart} onRetry={() => setFlowchart({ ...flowchart, loading: true, error: null })}/>
      </TabsContent>
      <TabsContent value="quiz">
        <QuizInitialSection {...quiz} onRetry={() => setQuiz({ ...quiz, loading: true, error: null })}/>
      </TabsContent>
    </Tabs>
  );
}
