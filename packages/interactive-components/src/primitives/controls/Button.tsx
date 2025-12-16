import * as React from 'react';
import { cx } from '../../utils/cx';
import { button } from '../../styles/recipes/controls.css';

export type ButtonVariant = NonNullable<Parameters<typeof button>[0]>['variant'];
export type ButtonSize = NonNullable<Parameters<typeof button>[0]>['size'];

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button(props: ButtonProps) {
  const { className, variant, size, type, ...rest } = props;
  return (
    <button
      type={type ?? 'button'}
      className={cx(button({ variant, size }), className)}
      {...rest}
    />
  );
}


