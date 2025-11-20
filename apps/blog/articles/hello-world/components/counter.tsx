"use client";

import React, { useState } from "react";
import { styled } from "@repo/interactive-ui";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, RotateCcw } from "lucide-react";

// -----------------------------------------------------------------------------
// Styled Components
// -----------------------------------------------------------------------------

const CounterRoot = styled(motion.div, {
  position: "relative",
  width: "100%",
  maxWidth: "24rem", // max-w-sm
  margin: "0 auto",
  padding: "2rem", // p-8
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2.5rem", // gap-10
  borderRadius: "2.5rem",
  borderWidth: "2px",
  borderStyle: "solid",
  backdropFilter: "blur(40px)", // backdrop-blur-2xl
  
  // Shadow
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", 
  
  // Default colors (will be overridden by animate prop for dynamic colors)
  backgroundColor: "$background",
  borderColor: "$border",

  // Dark mode adjustments if needed, though animate prop handles much of it
});

const ResetButtonWrapper = styled("div", {
  position: "absolute",
  top: "1.5rem", // top-6
  right: "1.5rem", // right-6
  zIndex: 20,
});

const ResetButton = styled(motion.button, {
  padding: "0.625rem", // p-2.5
  borderRadius: "9999px", // full
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  cursor: "pointer",
  
  // Colors
  color: "$textSecondary",
  backgroundColor: "$zinc100", // zinc-100
  
  transition: "color 0.2s, background-color 0.2s",
  
  "&:hover": {
    color: "$text",
    backgroundColor: "$zinc200",
  },
});

const DisplayContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.75rem", // gap-3
  zIndex: 10,
  width: "100%",
});

const DisplayLabel = styled(motion.span, {
  fontSize: "$1", // text-xs
  fontWeight: 700, // font-bold
  letterSpacing: "0.1em", // tracking-widest
  textTransform: "uppercase",
});

const NumberContainer = styled("div", {
  position: "relative",
  height: "8rem", // h-32
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const NumberValue = styled(motion.div, {
  fontSize: "6rem", // text-8xl
  fontWeight: 900, // font-black
  letterSpacing: "-0.05em", // tracking-tighter
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1,
  
  // Gradient Text emulation
  background: "linear-gradient(to bottom, $text, $textSecondary)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  
  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))", // drop-shadow-sm
});

const ControlsContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "1rem", // gap-4
  width: "100%",
  zIndex: 10,
});

const ControlButton = styled(motion.button, {
  flex: 1,
  padding: "1.25rem 0", // py-5
  borderRadius: "1rem", // rounded-2xl
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  
  variants: {
    variant: {
      secondary: {
        backgroundColor: "$background",
        border: "1px solid $border",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", // shadow-lg
        
        "&:hover": {
          borderColor: "#fecdd3", // rose-200
          boxShadow: "0 4px 6px -1px rgba(255, 228, 230, 0.5)", // shadow-rose-100/50
        },
        
        // Icon color logic will be handled in children or via CSS selector
        color: "$textSecondary",
        "&:hover svg": {
          color: "#f43f5e", // rose-500
        },
      },
      primary: {
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", // blue-500 to blue-600
        border: "1px solid #60a5fa", // blue-400
        boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)", // shadow-blue-500/30
        color: "white",
      },
    },
  },
  
  defaultVariants: {
    variant: "secondary",
  },
});

// -----------------------------------------------------------------------------
// Animation Variants
// -----------------------------------------------------------------------------

const numberVariants = {
  initial: (direction: number) => ({
    y: direction > 0 ? 40 : -40,
    opacity: 0,
    filter: "blur(12px)",
    scale: 0.5,
    rotateX: direction > 0 ? -45 : 45,
  }),
  animate: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -40 : 40,
    opacity: 0,
    filter: "blur(12px)",
    scale: 0.5,
    rotateX: direction > 0 ? 45 : -45,
    transition: {
      duration: 0.2,
    },
  }),
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function Counter() {
  const [count, setCount] = useState(0);
  const [direction, setDirection] = useState(0); // -1: decrease, 1: increase

  const handleIncrement = () => {
    setDirection(1);
    setCount((c) => c + 1);
  };

  const handleDecrement = () => {
    setDirection(-1);
    setCount((c) => c - 1);
  };

  const handleReset = () => {
    setDirection(count > 0 ? -1 : 1);
    setCount(0);
  };

  // Dynamic styles based on count state
  const containerStyles = {
    backgroundColor: count > 0 
      ? "rgba(59, 130, 246, 0.03)" // Blue tint
      : count < 0 
        ? "rgba(244, 63, 94, 0.03)" // Rose tint
        : "rgba(113, 113, 122, 0.03)", // zinc tint
    borderColor: count > 0 
      ? "rgba(59, 130, 246, 0.2)" 
      : count < 0 
        ? "rgba(244, 63, 94, 0.2)" 
        : "rgba(228, 228, 231, 0.4)",
  };

  const labelColor = count > 0 
    ? "rgb(59, 130, 246)" 
    : count < 0 
      ? "rgb(244, 63, 94)" 
      : "rgb(113, 113, 122)";

  return (
    <CounterRoot
      initial={false}
      animate={containerStyles}
      transition={{ duration: 0.5 }}
    >
      {/* Reset Button */}
      <ResetButtonWrapper>
        <ResetButton
          whileHover={{ rotate: 180, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleReset}
          aria-label="Reset counter"
        >
          <RotateCcw size={16} />
        </ResetButton>
      </ResetButtonWrapper>

      {/* Counter Display */}
      <DisplayContainer>
        <DisplayLabel 
          animate={{ color: labelColor }}
        >
          Current Count
        </DisplayLabel>
        
        <NumberContainer>
          <AnimatePresence mode="popLayout" custom={direction}>
            <NumberValue
              key={count}
              custom={direction}
              variants={numberVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {count}
            </NumberValue>
          </AnimatePresence>
        </NumberContainer>
      </DisplayContainer>

      {/* Control Buttons */}
      <ControlsContainer>
        <ControlButton
          variant="secondary"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.95, y: 0 }}
          onClick={handleDecrement}
        >
          <Minus size={24} />
        </ControlButton>

        <ControlButton
          variant="primary"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.95, y: 0 }}
          onClick={handleIncrement}
        >
          <Plus size={24} />
        </ControlButton>
      </ControlsContainer>
    </CounterRoot>
  );
}
