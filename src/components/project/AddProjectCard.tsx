import AddIcon from "@/assets/icons/plus-add.svg";
import Image from "next/image";

interface AddProjectCardProps {
  onClick: () => void;
}

const AddProjectCard = ({ onClick }: AddProjectCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 h-full min-h-[120px] rounded-lg border border-dashed border-surface-highest text-neutral hover:bg-surface-low hover:text-primary transition-colors duration-300 cursor-pointer"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-low">
        <Image src={AddIcon} alt="AddIcon" width={20} height={20} />
      </span>
      <span className="text-label-sm tracking-label-sm font-medium uppercase">
        Add Project
      </span>
    </button>
  );
};

export default AddProjectCard;
