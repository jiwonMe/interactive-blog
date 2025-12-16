import * as React from 'react';
import { cx } from '../../utils/cx';
import * as RadixSlider from '@radix-ui/react-slider';
import { fieldHelp, fieldLabel, fieldRoot, radixSliderRange, radixSliderRoot, radixSliderThumb, radixSliderTrack } from '../../styles/recipes/controls.css';

export interface SliderProps {
  className?: string;
  label?: string;
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}

export function Slider(props: SliderProps) {
  const {
    className,
    label,
    helpText,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    value,
    defaultValue,
    onValueChange,
  } = props;

  const isControlled = value !== undefined;
  const radixValue = isControlled ? [value] : undefined;
  const radixDefaultValue = defaultValue !== undefined ? [defaultValue] : undefined;

  return (
    <div className={cx(fieldRoot, className)}>
      {label ? <div className={fieldLabel}>{label}</div> : null}
      <RadixSlider.Root
        className={radixSliderRoot}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={radixValue}
        defaultValue={radixDefaultValue}
        onValueChange={(v) => onValueChange?.(v[0] ?? 0)}
      >
        <RadixSlider.Track className={radixSliderTrack}>
          <RadixSlider.Range className={radixSliderRange} />
        </RadixSlider.Track>
        <RadixSlider.Thumb className={radixSliderThumb} />
      </RadixSlider.Root>
      {helpText ? <div className={fieldHelp}>{helpText}</div> : null}
    </div>
  );
}



