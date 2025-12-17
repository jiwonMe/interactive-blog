import * as React from 'react';
import { cx } from '../../utils/cx';
import { fieldHelp, fieldLabel, fieldRoot, inputBase } from '../../styles/recipes/controls.css';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helpText?: string;
}

export function NumberInput(props: NumberInputProps) {
  const { className, label, helpText, ...rest } = props;
  return (
    <div className={cx(fieldRoot, className)}>
      {label ? <div className={fieldLabel}>{label}</div> : null}
      <input type="number" className={inputBase} {...rest} />
      {helpText ? <div className={fieldHelp}>{helpText}</div> : null}
    </div>
  );
}




