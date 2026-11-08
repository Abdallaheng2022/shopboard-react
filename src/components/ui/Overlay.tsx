// Overlay.tsx: the dark layer behind a dialog. A click on the layer itself (not on what is
// inside it) calls onClose. Used by the sign-up form.
import type { ReactNode } from "react";

interface OverlayProps {
  // The CSS class of the layer, like "overlay" for a centred dialog.
  className: string;
  onClose: () => void;
  children: ReactNode;
}

export function Overlay({ className, onClose, children }: OverlayProps) {
  return (
    <div
      className={className}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}
