import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`
        px-4 py-2 rounded-lg font-semibold transition-all duration-200
        bg-[var(--color-dark)] text-[var(--color-lavender)]
        hover:bg-[var(--color-lavender)] hover:text-[var(--color-dark)]
        hover:scale-105
        shadow
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
