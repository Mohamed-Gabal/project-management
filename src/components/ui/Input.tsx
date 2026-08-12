import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...rest }, ref) => {
    return (
      <div>
        <label
          htmlFor={rest.id}
          className="block text-label-sm font-bold text-neutral tracking-label-sm mb-1.5"
        >
          {label}
        </label>

        <input
          ref={ref}
          id={rest.id}
          className={`h-12 w-full rounded-lg bg-surface-highest px-3.5 text-body-md text-neutral-dark placeholder:text-neutral outline-none transition ${error ? "ring-2 ring-error" : "focus:ring-2 focus:ring-primary-container"} ${className}`}
          {...rest}
        />

        {helperText && !error && (
          <p className="text-label-sm text-neutral mt-1">{helperText}</p>
        )}

        {error && <p className="text-label-sm text-error mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
