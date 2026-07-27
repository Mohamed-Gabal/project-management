const ProjectSkeleton = () => {
  return (
    <div className="bg-surface border border-surface-highest rounded-lg p-4 h-full animate-pulse">
      <div className="h-20 w-full rounded-md bg-surface-low" />
      <div className="h-3 w-2/3 rounded bg-surface-low mt-3" />
      <div className="flex items-center justify-between mt-6">
        <div className="h-2.5 w-16 rounded bg-surface-low" />
        <div className="h-2.5 w-14 rounded bg-surface-low" />
      </div>
    </div>
  );
};

export default ProjectSkeleton;
