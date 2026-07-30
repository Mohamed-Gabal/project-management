"use client";

import { useState, useEffect } from "react";
import { getProjects } from "@/services/project";
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

  // Current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Total number of projects
  const [totalCount, setTotalCount] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  // Number of projects displayed per page
  const limit = 10;

  // Calculate How Many Projects To Skip Before Fetching the Current Page
  const offset = (currentPage - 1) * limit;

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

    const result = await getProjects(limit, offset);

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

    // Append new projects when loading additional pages on mobile
    if (currentPage === 1) {
      setProjects(result.data);
    } else {
      setProjects((prev) => [...prev, ...result.data]);
    }
    // Save total projects count
    setTotalCount(result.totalCount);
    setStatus("success");
  };

  // Update projects list whenever the current page changes
  useEffect(() => {
    loadProjects();
  }, [currentPage]);

  // Detect screen size to enable infinite scroll only on mobile devices
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();

    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Load the next page automatically when the user reaches the bottom of the page on mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        const totalPages = Math.ceil(totalCount / limit);

        if (currentPage >= totalPages) return;

        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, currentPage, totalCount]);

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
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            limit={limit}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
};

export default ProjectPage;
