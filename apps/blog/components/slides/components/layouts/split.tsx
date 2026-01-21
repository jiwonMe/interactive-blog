import { Children, type ReactNode } from "react";
import { cn } from "../../../../lib/utils";

type SplitProps = {
  children: ReactNode;
  ratio?: string;
  direction?: "horizontal" | "vertical";
  className?: string;
};

export function Split({
  children,
  ratio = "1:1",
  direction = "horizontal",
  className,
}: SplitProps) {
  const childArray = Children.toArray(children);
  const [leftRatio, rightRatio] = ratio.split(":").map(Number);
  const total = leftRatio + rightRatio;

  const isHorizontal = direction === "horizontal";

  return (
    <div
      className={cn(
        "flex min-h-full w-full gap-8",
        isHorizontal ? "flex-row" : "flex-col",
        className,
      )}
    >
      {childArray.map((child, index) => {
        const flexValue = index === 0 ? leftRatio / total : rightRatio / total;
        return (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center",
              isHorizontal ? "h-full" : "w-full",
            )}
            style={{ flex: flexValue }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
