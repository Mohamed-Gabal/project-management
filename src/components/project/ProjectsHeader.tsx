import Image from "next/image";
import PlusIcon from "@/assets/icons/plus.svg";

interface ProjectsHeaderProps {
  onCreateProject: () => void;
}

const ProjectsHeader = ({ onCreateProject }: ProjectsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-headline-lg tracking-headline-lg font-semibold text-neutral-dark">
          Projects
        </h1>
        <p className="text-body-md text-neutral mt-1">
          Manage and curate your projects
        </p>
      </div>

      <button
        onClick={onCreateProject}
        className="flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-surface text-title-md font-medium shadow-card hover:bg-primary-container transition-colors duration-300 cursor-pointer"
      >
        <Image src={PlusIcon} alt="PlusIcon" width={16} height={16} />
        Create New Project
      </button>
    </div>
  );
};

export default ProjectsHeader;
