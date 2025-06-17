import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "submit" | "reset" | "button";
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    className,
    type = "button",
}) => (
    <button
        onClick={onClick}
        type={type}
        className={`flex items-center justify-center w-full px-4 py-2 bg-transparent border border-slate-900 rounded-lg text-slate-900 hover:text-white hover:bg-slate-900 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer ${className}`}
    >
        {children}
    </button>
);
