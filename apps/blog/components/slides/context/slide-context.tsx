"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

type SlideState = {
  currentIndex: number;
  totalSlides: number;
  currentStep: number;
  totalSteps: number;
  notes: Map<number, string>;
};

type SlideActions = {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  setTotalSteps: (count: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSteps: () => void;
  registerNotes: (index: number, notes: string) => void;
  getCurrentNotes: () => string | undefined;
};

type SlideContextValue = SlideState & SlideActions;

const SlideContext = createContext<SlideContextValue | null>(null);

type SlideProviderProps = {
  children: ReactNode;
  totalSlides: number;
  initialIndex?: number;
  onSlideChange?: (index: number) => void;
};

export function SlideProvider({
  children,
  totalSlides,
  initialIndex = 0,
  onSlideChange,
}: SlideProviderProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalStepsState] = useState(0);
  const [notes] = useState<Map<number, string>>(new Map());

  const goTo = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));
      setCurrentIndex(clampedIndex);
      setCurrentStep(0);
      setTotalStepsState(0);
      onSlideChange?.(clampedIndex);
    },
    [totalSlides, onSlideChange],
  );

  const next = useCallback(() => {
    if (totalSteps > 0 && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentIndex < totalSlides - 1) {
      goTo(currentIndex + 1);
    }
  }, [currentIndex, currentStep, totalSlides, totalSteps, goTo]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else if (currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  }, [currentIndex, currentStep, goTo]);

  const setTotalSteps = useCallback((count: number) => {
    setTotalStepsState(count);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const resetSteps = useCallback(() => {
    setCurrentStep(0);
    setTotalStepsState(0);
  }, []);

  const registerNotes = useCallback(
    (index: number, notesContent: string) => {
      notes.set(index, notesContent);
    },
    [notes],
  );

  const getCurrentNotes = useCallback(() => {
    return notes.get(currentIndex);
  }, [notes, currentIndex]);

  const value = useMemo<SlideContextValue>(
    () => ({
      currentIndex,
      totalSlides,
      currentStep,
      totalSteps,
      notes,
      next,
      prev,
      goTo,
      setTotalSteps,
      nextStep,
      prevStep,
      resetSteps,
      registerNotes,
      getCurrentNotes,
    }),
    [
      currentIndex,
      totalSlides,
      currentStep,
      totalSteps,
      notes,
      next,
      prev,
      goTo,
      setTotalSteps,
      nextStep,
      prevStep,
      resetSteps,
      registerNotes,
      getCurrentNotes,
    ],
  );

  return (
    <SlideContext.Provider value={value}>{children}</SlideContext.Provider>
  );
}

export function useSlide() {
  const context = useContext(SlideContext);
  if (!context) {
    throw new Error("useSlide must be used within a SlideProvider");
  }
  return context;
}

export function useSlideOptional() {
  return useContext(SlideContext);
}
