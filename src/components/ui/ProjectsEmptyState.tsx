import Image from "next/image";
import ProjectImg from "@/assets/Images/project-img.jpg";
import AddIcon from "@/assets/icons/plus-add.svg";

interface ProjectsEmptyStateProps {
  onCreateProject: () => void;
}

const ProjectsEmptyState = ({ onCreateProject }: ProjectsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="w-20 h-20 rounded-lg bg-surface-low flex items-center justify-center">
        <Image src={ProjectImg} alt="ProjectImg" width={100} height={100} />
      </div>

      <h2 className="text-title-md font-semibold text-neutral-dark mt-6">
        No Projects
      </h2>
      <p className="text-body-md text-neutral mt-2 max-w-sm">
        You don&apos;t have any projects yet. Start by defining your first
        architectural workspace to begin tracking tasks and epics.
      </p>

      <button
        onClick={onCreateProject}
        className="flex items-center gap-2 h-10 px-4 mt-6 rounded-md bg-primary text-surface text-title-md font-medium hover:bg-primary-container transition-colors duration-300 cursor-pointer"
      >
        <Image src={AddIcon} alt="AddIcon" width={20} height={20} />
        Create New Project
      </button>
    </div>
  );
};

export default ProjectsEmptyState;
