"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const MyStatisticsError = ({ reset }: ErrorProps) => {
  return (
    <section
      className="flex flex-col items-center justify-center gap-4 p-16"
      role="alert"
    >
      <p className="text-lg font-semibold text-[#BA1A1A]">
        Something went wrong loading your statistics.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-[8px] bg-[#0052CC] px-4 py-2 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </section>
  );
};

export default MyStatisticsError;
