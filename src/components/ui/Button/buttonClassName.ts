// buttonClassName.ts: the CSS classes Button and ButtonLink share, so both look the same.
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

// The props both components take to choose their look.
export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// Joins the base class, the variant, the size and any extra class from the parent.
export function buttonClassName(variant: ButtonVariant, size: ButtonSize, extra?: string): string {
  return [styles.button, styles[variant], size === "lg" ? styles.lg : "", extra ?? ""]
    .filter((name) => name !== "")
    .join(" ");
}
