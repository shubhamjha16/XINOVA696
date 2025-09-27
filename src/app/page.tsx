import { TopicForm } from "@/components/home/TopicForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, BookCheck, Puzzle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12">
      <div className="space-y-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-primary">
          Welcome to XinovaAI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          An intelligent, AI-driven platform to optimize and personalize computer science learning.
          Enter any syllabus unit, and let Xinova generate a dynamic learning experience for you.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <TopicForm />
      </div>

      <div className="w-full max-w-5xl pt-12">
        <h2 className="text-3xl font-bold font-headline mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="items-center">
              <div className="p-4 bg-secondary rounded-full">
                <BookCheck className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Background Theory</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get comprehensive yet concise explanations of core concepts, blending theory with practical insights.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <div className="p-4 bg-secondary rounded-full">
                <BrainCircuit className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Visual Flowchart</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Visualize relationships between concepts with an AI-generated text-based flowchart for better retention.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <div className="p-4 bg-secondary rounded-full">
                <Puzzle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Interactive Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Test your knowledge with a 15-question quiz, including coding challenges and instant feedback.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
