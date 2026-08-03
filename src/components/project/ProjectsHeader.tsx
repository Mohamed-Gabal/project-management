// import Image from "next/image";
// import PlusIcon from "@/assets/icons/plus.svg";
// import Button from "@/components/ui/Button";

// interface ProjectsHeaderProps {
//   title: string;
//   description: string;
//   buttonText: string;
//   buttonIcon: StaticImageData;
//   onButtonClick: () => void;
// }

// interface ProjectsHeaderProps {
//   onCreateProject: () => void;
// }

// const ProjectsHeader = ({ onCreateProject }: ProjectsHeaderProps) => {
//   return (
//     <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//       <div>
//         <h1 className="text-headline-lg tracking-headline-lg font-semibold text-neutral-dark">
//           Projects
//         </h1>
//         <p className="text-body-md text-neutral mt-1">
//           Manage and curate your projects
//         </p>
//       </div>

//       {/* Create Project Button */}
//       <Button
//         onClick={onCreateProject}
//         className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-4 rounded-md text-surface text-title-md shadow-card"
//       >
//         <Image src={PlusIcon} alt="PlusIcon" width={16} height={16} />
//         Create New Project
//       </Button>
//     </div>
//   );
// };

// export default ProjectsHeader;
import Image, { StaticImageData } from "next/image";
import Button from "@/components/ui/Button";

interface ProjectsHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon: StaticImageData;
  onButtonClick: () => void;
}

const ProjectsHeader = ({
  title,
  description,
  buttonText,
  buttonIcon,
  onButtonClick,
}: ProjectsHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-headline-lg font-bold text-neutral-dark">
          {title}
        </h1>

        {description && (
          <p className="text-body-md text-neutral">{description}</p>
        )}
      </div>

      <Button
        onClick={onButtonClick}
        className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-4 rounded-md text-title-md shadow-card"
      >
        <Image src={buttonIcon} alt="" width={16} height={16} />
        {buttonText}
      </Button>
    </div>
  );
};

export default ProjectsHeader;
