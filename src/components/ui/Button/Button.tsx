// Button.tsx: the app's button. For a button that goes to another page, use ButtonLink.
import type { ButtonHTMLAttributes } from "react";
import { buttonClassName, type ButtonStyleProps } from "./buttonClassName";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...rest
}: ButtonProps) {
  return <button type={type} className={buttonClassName(variant, size, className)} {...rest} />;
}
