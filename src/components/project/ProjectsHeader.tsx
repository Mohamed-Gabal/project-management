import Image, { StaticImageData } from "next/image";
import Button from "@/components/ui/Button";
import { ReactNode } from "react";

interface ProjectsHeaderProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonIcon?: StaticImageData;
  onButtonClick?: () => void;
  rightContent?: ReactNode;
  actionSlot?: ReactNode;
}

const ProjectsHeader = ({
  title,
  description,
  buttonText,
  buttonIcon,
  onButtonClick,
  rightContent,
  actionSlot,
}: ProjectsHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title + Description */}
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

      <div className="flex items-center gap-15">
        {/* Right Content */}
        {rightContent && <div className="w-[303px]">{rightContent}</div>}

        {actionSlot}

        {/* Make the button optional so this header can be reused on pages that don't need an action button */}
        {!actionSlot && buttonText && buttonIcon && onButtonClick && (
          <Button
            onClick={onButtonClick}
            className="w-full hidden md:flex sm:w-auto items-center justify-center gap-2 h-10 px-4 rounded-md text-title-md shadow-card"
          >
            <Image src={buttonIcon} alt="" width={16} height={16} />
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectsHeader;
