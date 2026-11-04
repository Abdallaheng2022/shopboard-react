// Button.tsx: the app's buttons. ButtonLink looks the same but navigates to another page.
import type { ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function getClassName(variant: ButtonVariant, size: ButtonSize, extra?: string): string {
  return [styles.button, styles[variant], size === "lg" ? styles.lg : "", extra ?? ""]
    .filter((name) => name !== "")
    .join(" ");
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...rest
}: ButtonProps) {
  return <button type={type} className={getClassName(variant, size, className)} {...rest} />;
}

interface ButtonLinkProps extends LinkProps, StyleProps {}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonLinkProps) {
  return <Link className={getClassName(variant, size, className)} {...rest} />;
}
