import ProjectsHeader from "@/components/project/ProjectsHeader";
import BreadCrumb from "@/components/ui/BreadCrumb";
import MembersList from "@/components/members/MembersList";
import { getProjectMembersFromDB } from "@/services/project.server";
import InviteMemberButton from "@/components/members/InviteMemberButton";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

const MembersPage = async ({ params }: PageProps) => {
  const { projectId } = await params;
  const response = await getProjectMembersFromDB(projectId);

  if (!response.ok) {
    throw new Error(response.message);
  }

  return (
    <section className="flex w-full min-w-0 max-w-[1024px] flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
      <BreadCrumb
        items={[
          { label: "Projects", href: "/project" },
          { label: "Project Name" },
          { label: "Members" },
        ]}
      />
      <ProjectsHeader
        title={"Project Members"}
        actionSlot={<InviteMemberButton projectId={projectId} />}
      />
      <MembersList members={response.data} />
    </section>
  );
};

export default MembersPage;
