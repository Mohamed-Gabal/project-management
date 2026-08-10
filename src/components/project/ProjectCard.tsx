"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const ProjectCard = ({
  id,
  name,
  description,
  createdAt,
}: ProjectCardProps) => {
  const router = useRouter();

  return (
    <article
      onClick={() => {
        router.push(`/project/${id}/epics`);
      }}
      className="w-full bg-surface shadow-card rounded-lg p-4 flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-300 cursor-pointer"
    >
      <div>
        <h3 className="text-title-md leading-tight mb-2 font-semibold text-neutral-dark flex items-center justify-between">
          {name}
          <Link
            onClick={(e) => e.stopPropagation()}
            className="bg-primary text-surface px-5 py-2 rounded-2xl hover:bg-primary-container transition-all duration-300"
            href={`/project/${id}/edit`}
          >
            Edit
          </Link>
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
  );
};

export default ProjectCard;
