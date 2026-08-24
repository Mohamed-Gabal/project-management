"use client";

import ProjectsErrorState from "@/components/ui/ProjectsErrorState";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ProjectsErrorState onRetry={reset} />;
}
