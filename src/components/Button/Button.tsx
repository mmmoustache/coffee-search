import type { IconName } from '@/design-tokens/icons.ts';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import './Button.css';

type CommonProps = {
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
  icon?: IconName;
  iconOnly?: boolean;
  iconPosition?: 'left' | 'right';
  size?: 'default' | 'large' | 'small';
  variant?: 'primary' | 'secondary';
};

// Button-only
type ButtonOnlyProps = {
  href?: never;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick' | 'disabled' | 'className' | 'children' | 'aria-label'
>;

// Link only
type LinkOnlyProps = {
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  // Disallow button-only props when acting as a link
  type?: never;
  disabled?: never;
} & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'onClick' | 'className' | 'children' | 'aria-label' | 'href'
>;

type ButtonProps = CommonProps & (ButtonOnlyProps | LinkOnlyProps);

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, Readonly<ButtonProps>>(
  function ButtonRoot(props, ref) {
    const {
      className = '',
      children,
      icon,
      iconOnly = false,
      iconPosition = 'right',
      variant = 'primary',
      size = 'default',
      ariaLabel,
      ...rest
    } = props;

    const isSmall = size === 'small';
    const isLarge = size === 'large';

    const classes = clsx(
      'button cursor-pointer inline-flex outline-0 border-2 gap-4 no-underline whitespace-nowrap focusable',
      className,
      isLarge ? 'font-title' : 'font-body',
      isSmall ? 'py-1' : 'py-3',
      isSmall ? null : 'min-h-12.5',
      iconOnly ? (isSmall ? 'px-1' : 'px-3') : isSmall ? 'px-3' : 'px-5'
    );

    // If iconOnly and no ariaLabel, fall back to string children
    let computedAriaLabel = ariaLabel;
    if (!computedAriaLabel && iconOnly && typeof children === 'string') {
      computedAriaLabel = children;
    }

    const content = (
      <>
        {children && !iconOnly && <span className="button__content">{children}</span>}
        {icon && (
          <span className="button__icon">
            <svg
              className="icon"
              width="1.25em"
              height="1.25em"
              fill="currentColor"
            >
              <use xlinkHref={`/icons/icons.svg#${icon}`} />
            </svg>
          </span>
        )}
      </>
    );

    // Link variant: presence of href decides
    if ('href' in props && typeof props.href === 'string') {
      const { href, target, rel, onClick, ...anchorRest } = rest as LinkOnlyProps;
      const relSafe = target === '_blank' ? rel || 'noopener noreferrer' : rel;

      return (
        <Link
          href={href}
          aria-label={computedAriaLabel}
          className={classes}
          data-icon-position={iconPosition}
          data-size={size}
          data-variant={variant}
          target={target}
          rel={relSafe}
          onClick={onClick}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...anchorRest}
        >
          {content}
        </Link>
      );
    }

    const { type = 'button', disabled = false, onClick, ...buttonRest } = rest as ButtonOnlyProps;

    return (
      <button
        aria-label={computedAriaLabel}
        className={classes}
        data-icon-position={iconPosition}
        data-size={size}
        data-variant={variant}
        disabled={disabled}
        onClick={onClick}
        type={type}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }
);

export { Button };
