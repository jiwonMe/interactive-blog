import { type ReactNode } from "react";
import { cn } from "../../../../lib/utils";

type FullProps = {
  children: ReactNode;
  className?: string;
};

export function Full({ children, className }: FullProps) {
  return (
    <div
      className={cn(
        "absolute inset-0",
        "flex items-center justify-center",
        "overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
