"use client";

import { useState } from "react";
import type { QuizData, QuizQuestion } from "@/lib/types";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, BookOpen, RefreshCw } from "lucide-react";

interface QuizSectionProps {
  quizData: QuizData;
}

export function QuizSection({ quizData }: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = quizData.quiz;
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    });
  };
  
  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  }

  const handleSubmit = () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (q.correctAnswerIndex === selectedAnswers[index]) {
        correctAnswers++;
      }
    });
    setScore((correctAnswers / questions.length) * 100);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <CardHeader>
          <CardTitle className="font-headline">Quiz Results</CardTitle>
          <CardDescription>You scored {score.toFixed(0)}%</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
                <Progress value={score} className="w-full" />
                <span className="font-bold">{score.toFixed(0)}%</span>
            </div>
          
          <Accordion type="single" collapsible className="w-full">
            {questions.map((q, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = q.correctAnswerIndex === userAnswer;
              return (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-4 text-left">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                      <span className="flex-grow">Question {index + 1}: {q.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-2">
                        {q.options.map((option, optionIndex) => {
                            const isCorrectAnswer = optionIndex === q.correctAnswerIndex;
                            const isUserAnswer = optionIndex === userAnswer;
                            return (
                                <div key={optionIndex} className={cn("p-3 rounded-md border text-sm", 
                                isCorrectAnswer ? "bg-green-100 border-green-300 dark:bg-green-900/50 dark:border-green-700" : "",
                                isUserAnswer && !isCorrectAnswer ? "bg-red-100 border-red-300 dark:bg-red-900/50 dark:border-red-700" : ""
                                )}>
                                {option}
                                {isCorrectAnswer && <span className="font-bold ml-2">(Correct Answer)</span>}
                                {isUserAnswer && !isCorrectAnswer && <span className="font-bold ml-2">(Your Answer)</span>}
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-md">
                        <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold">Explanation</h4>
                            <p className="text-muted-foreground text-sm">{q.explanation}</p>
                        </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <Button onClick={handleReset} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline">Quiz</CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
        
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
                <Badge variant="outline">{currentQuestion.difficulty}</Badge>
            </div>
            {currentQuestion.difficulty === 'coding' && 
                <p className="text-sm text-muted-foreground">This is a coding challenge. Analyze the code and choose the best option.</p>
            }
        </div>

        <RadioGroup
          value={selectedAnswers[currentQuestionIndex]?.toString()}
          onValueChange={(value) => handleSelectOption(parseInt(value))}
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              {currentQuestion.difficulty === 'coding' ? (
                 <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    <pre className="font-code text-sm bg-muted/50 p-3 rounded-md overflow-x-auto"><code>{option}</code></pre>
                 </Label>
              ) : (
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
              )}
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length !== questions.length}
              className="bg-accent hover:bg-accent/90"
            >
              Submit Quiz
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );
}
