"use client";

import { useFormStatus } from "react-dom";
import { startLearning } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} size="lg" className="bg-accent hover:bg-accent/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          Start Learning
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export function TopicForm() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Enter a Topic</CardTitle>
        <CardDescription>
          What computer science topic would you like to master today?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={startLearning} className="flex flex-col sm:flex-row gap-4">
          <Input
            name="topic"
            type="text"
            placeholder="e.g., 'Big O Notation', 'React Hooks', 'SQL Joins'"
            required
            className="flex-grow text-base"
          />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
