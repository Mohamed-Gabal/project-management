import ErrorIcon from "@/assets/icons/error.svg";
import Image from "next/image";

interface ProjectsErrorStateProps {
  onRetry: () => void;
}

const ProjectsErrorState = ({ onRetry }: ProjectsErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center">
        <Image src={ErrorIcon} alt="ErrorIcon" width={50} height={50} />
      </div>

      <h2 className="text-title-md font-semibold leading-1.4 mt-4">
        Something went wrong
      </h2>
      <p className=" w-[307.5px] text-body-md text-neutral mt-2">
        We&apos;re having trouble retrieving your projects right now. Please try
        again in a moment.
      </p>

      <button
        onClick={onRetry}
        className="h-10 px-4 mt-6 rounded-md bg-primary text-surface text-title-md font-medium hover:bg-primary-container transition-colors duration-300 cursor-pointer"
      >
        Retry Connection
      </button>
    </div>
  );
};

export default ProjectsErrorState;
