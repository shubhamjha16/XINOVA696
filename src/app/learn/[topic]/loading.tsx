import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full animate-pulse">
      <Skeleton className="h-12 w-3/4 mx-auto mb-8" />
      <Card>
        <CardHeader>
          <div className="flex space-x-2 border-b">
            <Skeleton className="h-10 w-32 rounded-none" />
            <Skeleton className="h-10 w-32 rounded-none bg-muted/50" />
            <Skeleton className="h-10 w-32 rounded-none bg-muted/50" />
          </div>
        </CardHeader>
        <CardContent className="space-y-10 pt-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
