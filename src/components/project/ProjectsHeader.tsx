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
      <div className="flex flex-col gap-2">
        <h1 className="text-headline-lg font-bold text-neutral-dark">
          {title}
        </h1>

        {description && (
          <p className="max-w-[342px] lg:max-w-[512px] text-body-md text-neutral">
            {description}
          </p>
        )}
      </div>

      {/* Make the button optional so this header can be reused on pages that don't need an action button */}
      {buttonText && buttonIcon && onButtonClick && (
        <Button
          onClick={onButtonClick}
          className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-4 rounded-md text-title-md shadow-card"
        >
          <Image src={buttonIcon} alt="" width={16} height={16} />
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default ProjectsHeader;
