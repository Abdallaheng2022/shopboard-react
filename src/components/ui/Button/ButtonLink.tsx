// ButtonLink.tsx: a link to another page that looks like a Button.
import { Link, type LinkProps } from "react-router";
import { buttonClassName, type ButtonStyleProps } from "./buttonClassName";

interface ButtonLinkProps extends LinkProps, ButtonStyleProps {}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonLinkProps) {
  return <Link className={buttonClassName(variant, size, className)} {...rest} />;
}
