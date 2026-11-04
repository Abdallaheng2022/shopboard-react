// Dialog.tsx: a modal on top of the page, built on the native <dialog> element.
// The parent owns `open`. Esc, the × button and a click on the backdrop all call onClose.
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "../Button/Button";
import styles from "./Dialog.module.css";

interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ open, title, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // showModal() needs the element, so this is the one place a ref drives the DOM.
  useEffect(() => {
    const dialog = ref.current;
    if (dialog === null) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      // Esc closes the native dialog; tell the parent so its state matches.
      onClose={onClose}
      // A click on the dark backdrop lands on the dialog itself, not on its content.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <Button variant="secondary" aria-label="Close" onClick={onClose}>
            ×
          </Button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
