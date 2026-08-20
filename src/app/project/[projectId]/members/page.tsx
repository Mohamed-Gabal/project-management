"use client";

import ProjectsHeader from "@/components/project/ProjectsHeader";
import BreadCrumb from "@/components/ui/BreadCrumb";
import inviteIcon from "@/assets/icons/invite-member.svg";
import MembersList from "@/components/members/MembersList";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectMembers } from "@/services/project";
import ProjectSkeleton from "@/components/ui/ProjectSkeleton";
import ProjectsErrorState from "@/components/ui/ProjectsErrorState";
import { ProjectMember } from "@/types/member";

type PageStatus = "loading" | "success" | "error";

const MembersPage = () => {
  // Members data returned from the API
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [status, setStatus] = useState<PageStatus>("loading");

  const params = useParams();

  // Get the selected project ID from the URL.
  const projectId = params.projectId as string;

  const fetchMembers = async () => {
    setStatus("loading");

    const response = await getProjectMembers(projectId);
    if (!response.ok) {
      setStatus("error");
      return;
    }

    setMembers(response.data);
    setStatus("success");
  };

  // Fetch members when the project ID becomes available or changes.
  useEffect(() => {
    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  return (
    <section className="w-full min-w-0 flex flex-col gap-8 max-w-[1024px] px-10 py-10">
      {/* Breadcrumb */}
      <BreadCrumb
        items={[
          { label: "Projects", href: "/project" },
          { label: "Project Name" },
          { label: "Members" },
        ]}
      />

      {/* Page Project Header */}
      <ProjectsHeader
        title={"Project Members"}
        buttonText="Invite Member"
        buttonIcon={inviteIcon}
      />

      {/* Loading state */}
      {status === "loading" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProjectSkeleton />
        </div>
      )}

      {/* Error state */}
      {status === "error" && <ProjectsErrorState onRetry={fetchMembers} />}

      {/*  */}
      {status === "success" && <MembersList members={members} />}
    </section>
  );
};

export default MembersPage;
