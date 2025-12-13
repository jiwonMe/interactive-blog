import React from "react";
import { cn } from "../../lib/utils";

export type BoxedVariant =
  | "default"
  | "note"
  | "theorem"
  | "lemma"
  | "claim"
  | "definition"
  | "proof";

type BoxedProps = {
  id?: string;
  title?: string;
  variant?: BoxedVariant;
  className?: string;
  children: React.ReactNode;
};

const variantContainerClassName = (variant: BoxedVariant) => {
  switch (variant) {
    case "theorem":
    case "lemma":
    case "claim":
    case "definition":
      // Keep the structure, but avoid colorful variants.
      // The label already conveys the semantic type; the UI should be driven by luminance.
      return cn(
        /* surface */
        "bg-zinc-50/70 dark:bg-zinc-900/40"
      );
    case "proof":
      return cn(
        /* surface (slightly stronger for emphasis) */
        "bg-zinc-100/70 dark:bg-zinc-900/50"
      );
    case "note":
    case "default":
    default:
      return cn(
        /* surface */
        "bg-zinc-50/60 dark:bg-zinc-900/30"
      );
  }
};

const variantBadgeClassName = (variant: BoxedVariant) => {
  switch (variant) {
    case "theorem":
    case "lemma":
    case "claim":
    case "definition":
      return cn(
        /* surface */
        "bg-zinc-200/70 dark:bg-zinc-800/60",
        /* text */
        "text-zinc-800 dark:text-zinc-200",
        /* ring */
        "ring-1 ring-inset ring-zinc-200/70 dark:ring-zinc-700/70"
      );
    case "proof":
      return cn(
        /* surface */
        "bg-zinc-200/80 dark:bg-zinc-800/70",
        /* text */
        "text-zinc-800 dark:text-zinc-200",
        /* ring */
        "ring-1 ring-inset ring-zinc-200/70 dark:ring-zinc-700/70"
      );
    case "note":
    case "default":
    default:
      return cn(
        /* surface */
        "bg-zinc-200/70 dark:bg-zinc-800/60",
        /* text */
        "text-zinc-800 dark:text-zinc-200",
        /* ring */
        "ring-1 ring-inset ring-zinc-200/70 dark:ring-zinc-700/70"
      );
  }
};

export function Boxed({
  id,
  title,
  variant = "default",
  className,
  children,
}: BoxedProps) {
  return (
    <section
      id={id}
      className={cn(
        /* layout */
        "my-8 rounded-xl",
        /* padding (mobile: tighter to avoid nested boxes squeezing content) */
        "px-4 py-4 sm:p-5",
        /* border (make separation clearly visible) */
        "border border-zinc-300/80 dark:border-zinc-700/80",
        /* typography */
        "leading-7",
        /* surface */
        variantContainerClassName(variant),
        className
      )}
    >
      {title ? (
        <header
          className={cn(
            /* layout */
            "mb-3 flex items-center gap-2",
            /* typography */
            "text-sm font-semibold tracking-tight"
          )}
        >
          <span
            className={cn(
              /* layout */
              "inline-flex items-center rounded-md px-2 py-0.5",
              /* typography */
              "text-xs font-semibold",
              /* colors */
              variantBadgeClassName(variant)
            )}
          >
            {title}
          </span>
        </header>
      ) : null}
      <div
        className={cn(
          /* typography */
          "text-zinc-800 dark:text-zinc-200"
        )}
      >
        {children}
      </div>
    </section>
  );
}

type LabeledBoxProps = {
  id?: string;
  no?: string | number;
  name?: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
};

const formatLabeledTitle = (label: string, props: LabeledBoxProps) => {
  const no = props.no !== undefined ? String(props.no) : undefined;
  const named = props.name ? `(${props.name})` : undefined;
  const computed = [label, no].filter(Boolean).join(" ");
  return [computed, named].filter(Boolean).join(" ");
};

export function Theorem(props: LabeledBoxProps) {
  return (
    <Boxed
      id={props.id}
      variant="theorem"
      title={props.title ?? formatLabeledTitle("정리", props)}
      className={props.className}
    >
      {props.children}
    </Boxed>
  );
}

export function Lemma(props: LabeledBoxProps) {
  return (
    <Boxed
      id={props.id}
      variant="lemma"
      title={props.title ?? formatLabeledTitle("보조정리", props)}
      className={props.className}
    >
      {props.children}
    </Boxed>
  );
}

export function Claim(props: LabeledBoxProps) {
  return (
    <Boxed
      id={props.id}
      variant="claim"
      title={props.title ?? formatLabeledTitle("주장", props)}
      className={props.className}
    >
      {props.children}
    </Boxed>
  );
}

export function Definition(props: LabeledBoxProps) {
  return (
    <Boxed
      id={props.id}
      variant="definition"
      title={props.title ?? formatLabeledTitle("정의", props)}
      className={props.className}
    >
      {props.children}
    </Boxed>
  );
}

type ProofProps = {
  id?: string;
  title?: string;
  end?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Proof({ id, title = "증명", end = true, className, children }: ProofProps) {
  return (
    <Boxed id={id} variant="proof" title={title} className={className}>
      <div
        className={cn(
          /* layout */
          "space-y-4",
          /* typography */
          "text-zinc-800 dark:text-zinc-200"
        )}
      >
        {children}
        {end ? (
          <div
            className={cn(
              /* layout */
              "pt-2 text-right",
              /* typography */
              "font-semibold text-zinc-700 dark:text-zinc-300"
            )}
            aria-label="End of proof"
          >
            □
          </div>
        ) : null}
      </div>
    </Boxed>
  );
}

type ProofStepsProps = {
  className?: string;
  children: React.ReactNode;
};

export function ProofSteps({ className, children }: ProofStepsProps) {
  return (
    <ol
      className={cn(
        /* layout */
        "my-4 space-y-2",
        /* indentation (mobile: slightly smaller) */
        "pl-5 sm:pl-6",
        /* typography */
        "list-decimal",
        className
      )}
    >
      {children}
    </ol>
  );
}

type ProofStepProps = {
  label?: string;
  children: React.ReactNode;
};

export function ProofStep({ label, children }: ProofStepProps) {
  return (
    <li
      className={cn(
        /* typography */
        "leading-7"
      )}
    >
      {label ? (
        <span
          className={cn(
            /* typography */
            "font-semibold text-zinc-900 dark:text-zinc-100"
          )}
        >
          {label}{" "}
        </span>
      ) : null}
      <span>{children}</span>
    </li>
  );
}


