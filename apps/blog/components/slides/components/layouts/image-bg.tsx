import { type ReactNode } from "react";
import { cn } from "../../../../lib/utils";

type ImageBgProps = {
  children: ReactNode;
  src: string;
  overlay?: number;
  className?: string;
};

export function ImageBg({
  children,
  src,
  overlay = 0.5,
  className,
}: ImageBgProps) {
  return (
    <div
      className={cn(
        "relative min-h-full w-full",
        "flex items-center justify-center",
        className,
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className="absolute inset-0 bg-black" style={{ opacity: overlay }} />
      <div className="relative z-10 text-white">{children}</div>
    </div>
  );
}
