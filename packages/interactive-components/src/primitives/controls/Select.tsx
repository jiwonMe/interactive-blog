import * as React from 'react';
import { cx } from '../../utils/cx';
import * as RadixSelect from '@radix-ui/react-select';
import { fieldHelp, fieldLabel, fieldRoot, radixSelectContent, radixSelectItem, radixSelectItemIndicator, radixSelectTrigger, radixSelectViewport } from '../../styles/recipes/controls.css';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface SelectProps {
  className?: string;
  label?: string;
  helpText?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

export function Select(props: SelectProps) {
  const { className, label, helpText, options, value, defaultValue, disabled, onValueChange } = props;
  return (
    <div className={cx(fieldRoot, className)}>
      {label ? <div className={fieldLabel}>{label}</div> : null}
      <RadixSelect.Root value={value} defaultValue={defaultValue} disabled={disabled} onValueChange={onValueChange}>
        <RadixSelect.Trigger className={radixSelectTrigger}>
          <RadixSelect.Value />
          <RadixSelect.Icon aria-hidden>▾</RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className={radixSelectContent} position="popper" sideOffset={6}>
            <RadixSelect.Viewport className={radixSelectViewport}>
              {options.map((o) => (
                <RadixSelect.Item key={o.value} value={o.value} disabled={o.disabled} className={radixSelectItem}>
                  <RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className={radixSelectItemIndicator}>✓</RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {helpText ? <div className={fieldHelp}>{helpText}</div> : null}
    </div>
  );
}




