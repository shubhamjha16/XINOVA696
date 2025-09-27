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
          Xinova is an intelligent, AI-driven platform designed to optimize and personalize computer science learning. Users simply input any unit from their syllabus, and Xinova generates a dynamic learning experience.
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
                Xinova provides a comprehensive yet concise explanation of core concepts, designed to offer both theoretical depth and practical insights. This ensures you not only understand the fundamentals but can also grasp their real-world applications.
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
                The AI generates a text-based flowchart to visualize the core concepts and relationships within the topic. This serves as an easy reference for the user and as a model that can quickly trace through key processes, facilitating better retention and understanding.
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
                A 15-question quiz with progressive difficulty and coding challenges. Each question comes with instant feedback and detailed explanations to ensure you learn from your mistakes and reinforce concepts.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full max-w-4xl pt-12 text-center">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Ideal for students preparing for exams, professionals looking to refine their skills, or educators enhancing their curriculum, Xinova turns any computer science syllabus unit into an interactive and dynamic learning experience. With its efficient, step-by-step learning approach, Xinova ensures that users not only comprehend topics but also build hands-on problem-solving skills.
        </p>
      </div>
    </div>
  );
}
