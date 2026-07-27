import Link from "next/link";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  // already formatted "DD MMM YYYY"
  createdAt: string;
}

const ProjectCard = ({
  id,
  name,
  description,
  createdAt,
}: ProjectCardProps) => {
  return (
    <Link href={`/project/${id}/epics`}>
      <article className="w-full bg-surface shadow-card rounded-lg p-4 flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-300 cursor-pointer">
        <div>
          <h3 className="text-title-md leading-tight mb-2 font-semibold text-neutral-dark">
            {name}
          </h3>
          <p className="text-body-md font-normal leading-snug text-neutral line-clamp-3">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <span className="text-[#737685] font-bold text-label-sm tracking-label-sm uppercase">
            Created At
          </span>
          <span className="text-label-sm text-[#434654] leading-tight font-medium">
            {createdAt}
          </span>
        </div>
      </article>
    </Link>
  );
};

export default ProjectCard;
