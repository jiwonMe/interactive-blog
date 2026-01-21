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
        "h-full w-full",
        "flex flex-col items-center justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
