

interface CardWrapperProps {
  headerLabel: string;
  backButton: string;
  backButtonHref: string;
  children: React.ReactNode;
}

export const CardWrapper = ({headerLabel , backButton, backButtonHref , children}: CardWrapperProps) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-h-[full] mx-auto mt-10 flex flex-col justify-center items-center max-w-[full]">
            {/* Header */}
            <h2 className="text-2xl font-semibold text-center mb-4">{headerLabel}</h2>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center">{children}</div>

            {/* Footer */}
            <div className="mt-6 text-center">
                <a href={backButtonHref} className="text-blue-500 hover:underline">
                {backButton}
                </a>
            </div>
        </div>
    )
}