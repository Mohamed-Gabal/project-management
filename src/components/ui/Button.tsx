// Reusable button component used across the application
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = ({ children, className = "", ...rest }: ButtonProps) => {
  return (
    <button
      className={`w-full rounded-lg bg-primary text-white text-title-md font-medium py-2.5 hover:bg-primary-container transition-colors cursor-pointer ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
