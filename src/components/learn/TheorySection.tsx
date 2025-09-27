import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TheorySectionProps {
  theory: string;
}

export function TheorySection({ theory }: TheorySectionProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline">Background Theory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap">
          {theory}
        </div>
      </CardContent>
    </>
  );
}
