// components/Loader.tsx
"use client";

type LoaderProps = {
    show: boolean; // control visibility
};

export default function Loader({ show }: LoaderProps) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
            {/* Spinner */}
            <div className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>
        </div>
    );
}
