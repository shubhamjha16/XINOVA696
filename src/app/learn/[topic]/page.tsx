import { LearnTabs } from '@/components/learn/LearnTabs';

type LearnPageProps = {
  params: {
    topic: string;
  };
};

export default function LearnPage({ params }: LearnPageProps) {
  const decodedTopic = decodeURIComponent(params.topic);

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter text-center mb-8">
        Learn: <span className="text-primary">{decodedTopic}</span>
      </h1>
      <LearnTabs topic={decodedTopic} />
    </div>
  );
}
