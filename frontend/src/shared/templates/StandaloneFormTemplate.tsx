import React from "react";

interface StandaloneFormTemplateProps {
    children: React.ReactNode;
    title: string;
    backgroundImageUrl?: string;
}

export const StandaloneFormTemplate: React.FC<StandaloneFormTemplateProps> = ({
    children,
    title,
    backgroundImageUrl,
}) => (
    <section className="min-h-screen min-w-screen bg-sky-100/80 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row min-h-screen">
            <div
                className="hidden md:block md:flex-1 bg-center w-full min-h-screen"
                style={{
                    backgroundImage: backgroundImageUrl
                        ? `url(${backgroundImageUrl})`
                        : undefined,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                }}
            ></div>
            <div className="w-full bg-white md:w-[480px] md:flex-shrink-0 flex flex-col justify-center items-center p-6 sm:p-12 dark:bg-slate-900 text-white">
                <div className="w-full max-w-md">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-center text-slate-900 md:text-3xl dark:text-white">
                            {title}
                        </h1>
                        <div>{children}</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);
