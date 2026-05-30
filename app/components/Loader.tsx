"use client";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function Loader({ size = "md", className = "", text }: LoaderProps) {
  const sizeConfig = {
    sm: { dots: "w-1.5 h-1.5", gap: "gap-1", text: "text-xs", wrapper: "gap-2" },
    md: { dots: "w-2 h-2", gap: "gap-1.5", text: "text-sm", wrapper: "gap-3" },
    lg: { dots: "w-3 h-3", gap: "gap-2", text: "text-base", wrapper: "gap-4" },
  };

  const cfg = sizeConfig[size];

  return (
    <>
      <style>{`
        @keyframes marketplace-bounce {
          0%, 80%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          40% { transform: translateY(-6px) scale(1.15); opacity: 1; }
        }
        @keyframes marketplace-pulse-ring {
          0% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(0.8); opacity: 0.6; }
        }
        @keyframes shimmer-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .mp-dot-1 { animation: marketplace-bounce 1.2s ease-in-out infinite; animation-delay: 0ms; }
        .mp-dot-2 { animation: marketplace-bounce 1.2s ease-in-out infinite; animation-delay: 150ms; }
        .mp-dot-3 { animation: marketplace-bounce 1.2s ease-in-out infinite; animation-delay: 300ms; }
        .mp-ring { animation: marketplace-pulse-ring 1.8s ease-in-out infinite; }
        .mp-shimmer-text {
          background: linear-gradient(90deg, #94a3b8 0%, #f1f5f9 40%, #94a3b8 60%, #64748b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-text 2s linear infinite;
        }
      `}</style>

      <div className={`inline-flex flex-col items-center justify-center ${cfg.wrapper} ${className}`}>
        <div className="relative flex items-center justify-center">
          <span
            className="mp-ring absolute rounded-full bg-indigo-400/20"
            style={{
              width: size === "sm" ? "28px" : size === "md" ? "40px" : "56px",
              height: size === "sm" ? "28px" : size === "md" ? "40px" : "56px",
            }}
          />
          <div className={`relative flex items-center ${cfg.gap}`}>
            <span className={`mp-dot-1 rounded-full bg-indigo-500 ${cfg.dots}`} />
            <span className={`mp-dot-2 rounded-full bg-violet-500 ${cfg.dots}`} />
            <span className={`mp-dot-3 rounded-full bg-indigo-400 ${cfg.dots}`} />
          </div>
        </div>
        {text && (
          <span className={`mp-shimmer-text font-medium tracking-wide ${cfg.text}`}>
            {text}
          </span>
        )}
      </div>
    </>
  );
}