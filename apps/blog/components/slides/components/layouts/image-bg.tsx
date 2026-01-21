import { type ReactNode } from "react";
import { cn } from "../../../../lib/utils";

type ImageBgProps = {
  children: ReactNode;
  src: string;
  overlay?: number;
  textColor?: "light" | "dark";
  className?: string;
};

export function ImageBg({
  children,
  src,
  overlay = 0.5,
  textColor = "light",
  className,
}: ImageBgProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 -m-16",
        "flex items-center justify-center",
        className,
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className="absolute inset-0 bg-black" style={{ opacity: overlay }} />
      <div
        className={cn(
          "relative z-10 p-16 w-full h-full flex items-center justify-center",
          textColor === "light" ? "slide-text-light" : "slide-text-dark",
        )}
      >
        {children}
      </div>
    </div>
  );
}
