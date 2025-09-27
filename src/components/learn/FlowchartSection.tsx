import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FlowchartSectionProps {
  flowchart: string;
}

export function FlowchartSection({ flowchart }: FlowchartSectionProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline">Conceptual Flowchart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
          <pre className="font-code text-sm text-foreground">
            <code>
              {flowchart}
            </code>
          </pre>
        </div>
      </CardContent>
    </>
  );
}
