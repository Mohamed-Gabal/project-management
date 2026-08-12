import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", children, ...rest }, ref) => {
    return (
      <div>
        <label
          htmlFor={rest.id}
          className="mb-1.5 block text-label-sm font-bold tracking-label-sm text-neutral"
        >
          {label}
        </label>

        <select
          ref={ref}
          id={rest.id}
          className={`h-12 w-full rounded-lg bg-surface-highest px-3.5 text-body-md text-neutral-dark outline-none transition ${
            error
              ? "ring-2 ring-error"
              : "focus:ring-2 focus:ring-primary-container"
          } ${className}`}
          {...rest}
        >
          {children}
        </select>

        {error && <p className="mt-1 text-label-sm text-error">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
