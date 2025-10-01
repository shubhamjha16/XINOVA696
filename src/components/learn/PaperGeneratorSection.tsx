'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Terminal, Bot, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { generateQuestionPaper, type GenerateQuestionPaperOutput } from '@/ai/flows/generate-question-paper';

interface PaperGeneratorSectionProps {
  topic: string;
  flowchart: string | null;
  hasPrereqs: boolean;
}

type Data<T> = {
  loading: boolean;
  error: string | null;
  data: T | null;
};

export function PaperGeneratorSection({ topic, flowchart, hasPrereqs }: PaperGeneratorSectionProps) {
  const [samplePaper, setSamplePaper] = useState('');
  const [paperState, setPaperState] = useState<Data<GenerateQuestionPaperOutput>>({
    loading: false,
    error: null,
    data: null,
  });

  const handleGenerate = async () => {
    if (!flowchart || !samplePaper) return;
    setPaperState({ loading: true, error: null, data: null });
    try {
      const data = await generateQuestionPaper({
        topic,
        flowchart,
        samplePaper,
      });
      setPaperState({ loading: false, error: null, data });
    } catch (e) {
      const error = e instanceof Error ? e.message : 'An unknown error occurred.';
      setPaperState({ loading: false, error, data: null });
    }
  };

  const renderGeneratedPaper = () => {
    if (!paperState.data) return null;

    return (
      <div className="mt-8 space-y-6">
        <h3 className="text-2xl font-bold font-headline">Generated Question Paper</h3>
        <div className="space-y-4 divide-y divide-border">
          {paperState.data.questions.map((q, index) => (
            <div key={index} className="pt-4">
              <p className="font-semibold">
                Q{index + 1}: {q.questionText}
              </p>
              <p className="text-sm text-muted-foreground text-right">[ {q.marks} Marks ]</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!hasPrereqs || !flowchart) {
      return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
          <p className="text-muted-foreground">Please generate the flowchart first.</p>
        </div>
      );
    }
    
    if (paperState.loading) {
       return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      );
    }
    
    if (paperState.error) {
       return (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Generation Error</AlertTitle>
            <AlertDescription>{paperState.error}</AlertDescription>
          </Alert>
          <Button onClick={handleGenerate} variant="secondary">
            Try Again
          </Button>
        </div>
      );
    }
    
    if (paperState.data) {
        return renderGeneratedPaper();
    }

    return null; // Initial state before generation is handled in the main return
  };


  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="font-headline">Paper Generator</CardTitle>
        <CardDescription>
          Paste a sample paper to use as a template for structure, style, and marking. The AI will generate a new paper on your topic using the flowchart for content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasPrereqs || !flowchart ? (
           <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-60">
             <p className="text-muted-foreground">Please generate the flowchart first to enable this feature.</p>
           </div>
        ) : (
            <>
                <div className="space-y-2">
                    <label htmlFor="sample-paper" className="font-medium">
                        Sample Paper Content
                    </label>
                    <Textarea
                        id="sample-paper"
                        placeholder="Paste the full text of a sample question paper here..."
                        value={samplePaper}
                        onChange={(e) => setSamplePaper(e.target.value)}
                        className="min-h-[200px] font-code text-sm"
                        disabled={paperState.loading}
                    />
                </div>
                <Button 
                    onClick={handleGenerate} 
                    disabled={!samplePaper || paperState.loading}
                >
                    {paperState.loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Bot className="mr-2" />
                            Generate Paper
                        </>
                    )}
                </Button>
                
                <div className="mt-6">
                    {renderContent()}
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}
