"use server";

import { redirect } from "next/navigation";

export async function startLearning(formData: FormData) {
  const topic = formData.get("topic") as string;
  if (topic) {
    redirect(`/learn/${encodeURIComponent(topic.trim())}`);
  }
}
