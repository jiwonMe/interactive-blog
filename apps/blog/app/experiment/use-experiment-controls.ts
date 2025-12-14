"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ControlType } from "./registry";

type UseExperimentControlsOptions = {
  controls: Record<string, ControlType>;
};

export function useExperimentControls({ controls }: UseExperimentControlsOptions) {
  // Initialize state with default values
  const [values, setValues] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    Object.entries(controls).forEach(([key, control]) => {
      defaults[key] = control.defaultValue;
    });
    return defaults;
  });

  // controls가 변경되면 values도 재초기화
  useEffect(() => {
    const defaults: Record<string, any> = {};
    Object.entries(controls).forEach(([key, control]) => {
      defaults[key] = control.defaultValue;
    });
    setValues(defaults);
  }, [controls]);

  const handleChange = useCallback((key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const hasControls = useMemo(
    () => Object.keys(controls).length > 0,
    [controls]
  );

  return {
    values,
    handleChange,
    hasControls,
    controls,
  };
}
