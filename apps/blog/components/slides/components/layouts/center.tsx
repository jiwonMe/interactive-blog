import { type ReactNode } from "react";
import { cn } from "../../../../lib/utils";

type CenterProps = {
  children: ReactNode;
  className?: string;
};

export function Center({ children, className }: CenterProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "h-full w-full",
        "text-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
