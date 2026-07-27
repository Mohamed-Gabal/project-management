"use client";

import { useState, useEffect } from "react";
import { getProjects } from "@/services/getProject";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/project/ProjectCard";
import ProjectsHeader from "@/components/project/ProjectsHeader";
import ProjectSkeleton from "@/components/project/ProjectSkeleton";
import Pagination from "@/components/project/Pagination";
import ProjectsErrorState from "@/components/project/ProjectsErrorState";
import ProjectsEmptyState from "@/components/project/ProjectsEmptyState";
import AddProjectCard from "@/components/project/AddProjectCard";

type PageStatus = "loading" | "success" | "empty" | "error";

interface Project {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
}

const ProjectPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<PageStatus>("loading");
  const [projects, setProjects] = useState<Project[]>([]);

  // Format Project Creation Date To: DD MM YYYY
  const formatDate = (data: string) => {
    return new Date(data).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const loadProjects = async () => {
    setStatus("loading");

    const result = await getProjects();

    if (!result.ok && result.status === 401) {
      router.push("/login");
      return;
    }
    if (!result.ok) {
      setStatus("error");
      return;
    }
    if (result.data.length === 0) {
      setStatus("empty");
      return;
    }
    setProjects(result.data);
    setStatus("success");
  };
  useEffect(() => {
    loadProjects();
  }, []);

  return (
    // Project Grid Section: Flow=Vertical, Width=Fill(1024), Padding=32, Gap=40
    <section className="w-full mx-auto flex flex-col gap-10 p-8">
      <ProjectsHeader onCreateProject={() => router.push("/project/add")} />

      {status === "loading" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProjectSkeleton />
        </div>
      )}

      {status === "error" && <ProjectsErrorState onRetry={loadProjects} />}

      {status === "empty" && (
        <ProjectsEmptyState
          onCreateProject={() => router.push("/project/add")}
        />
      )}

      {status === "success" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                description={project.description || ""}
                createdAt={formatDate(project.created_at)}
              />
            ))}
            <AddProjectCard onClick={() => router.push("/project/add")} />
          </div>
          <Pagination />
        </>
      )}
    </section>
  );
};

export default ProjectPage;
