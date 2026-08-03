// Reusable button component used across the application
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = ({ children, className = "", ...rest }: ButtonProps) => {
  return (
    <button
      className={`bg-primary text-surface font-medium hover:bg-primary-container transition-colors cursor-pointer ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
