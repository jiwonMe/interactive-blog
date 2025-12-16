import * as React from 'react';
import { cx } from '../../utils/cx';
import * as RadixSwitch from '@radix-ui/react-switch';
import { radixSwitchRoot, radixSwitchThumb } from '../../styles/recipes/controls.css';

export interface ToggleProps {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Toggle(props: ToggleProps) {
  const {
    className,
    checked,
    defaultChecked,
    disabled,
    onCheckedChange,
  } = props;

  return (
    <RadixSwitch.Root
      className={cx(radixSwitchRoot, className)}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
    >
      <RadixSwitch.Thumb className={radixSwitchThumb} />
    </RadixSwitch.Root>
  );
}



