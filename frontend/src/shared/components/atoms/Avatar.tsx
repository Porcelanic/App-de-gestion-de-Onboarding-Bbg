import React from "react";
import { FaUserCircle } from "react-icons/fa";

interface AvatarProps {
    src?: string | null;
    alt: string;
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, className }) => {
    const baseClassName = "w-8 h-8 rounded-full";
    const combinedClassName = `${baseClassName} ${className || "dark:color-white"}`;

    if (!src) {
        return <FaUserCircle className={combinedClassName} aria-label={alt} />;
    }

    return <img className={combinedClassName} src={src} alt={alt} />;
};

export default Avatar;
