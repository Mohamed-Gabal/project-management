const MyStatisticsLoading = () => {
  return (
    <section
      className="flex flex-col w-[1024px] max-w-full p-8 gap-8 animate-pulse"
      aria-busy="true"
      aria-label="Loading statistics"
    >
      <div className="h-8 w-64 rounded bg-[#E9F0FF]" />
      <div className="h-[68px] w-[960px] max-w-full rounded-[8px] bg-[#F1F3FF]" />
      <div className="grid grid-cols-3 gap-4 w-[960px] max-w-full">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[104px] rounded-[8px] bg-[#F4F5F7]" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-3 w-[960px] max-w-full h-[420px]">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="rounded-[8px] bg-[#F4F5F7]" />
        ))}
      </div>
    </section>
  );
};

export default MyStatisticsLoading;
