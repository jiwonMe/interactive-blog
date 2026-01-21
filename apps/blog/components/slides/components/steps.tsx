"use client";

import { Children, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { useSlideOptional } from "../context/slide-context";

type StepsProps = {
  children: ReactNode;
};

export function Steps({ children }: StepsProps) {
  const slideContext = useSlideOptional();
  const isInSlideMode = !!slideContext;
  const currentStep = slideContext?.currentStep ?? Infinity;
  const setTotalSteps = slideContext?.setTotalSteps;

  const childArray = Children.toArray(children);
  const totalSteps = childArray.length;

  useEffect(() => {
    if (setTotalSteps) {
      setTotalSteps(totalSteps);
      return () => setTotalSteps(0);
    }
  }, [totalSteps, setTotalSteps]);

  if (!isInSlideMode) {
    return <div className="steps-container">{children}</div>;
  }

  return (
    <div className="steps-container">
      {childArray.map((child, index) => {
        const isVisible = index <= currentStep;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 10,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn("step-item", !isVisible && "pointer-events-none")}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
