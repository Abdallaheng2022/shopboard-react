// RegisterDialog.tsx: the sign-up form in a dialog. The browser validates the fields before submit.
// No sign-up endpoint is used yet, so submitting only confirms with a toast.
import { useId, type FormEvent } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { useToast } from "@/components/ui/Toast/useToast";
import styles from "./RegisterDialog.module.css";

// The shortest password the form accepts.
const MIN_PASSWORD_LENGTH = 8;

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
}

export function RegisterDialog({ open, onClose }: RegisterDialogProps) {
  const id = useId();
  const { showToast } = useToast();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    showToast("Account created.");
    event.currentTarget.reset();
    onClose();
  }

  return (
    <Dialog open={open} title="Create your account" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor={`${id}-name`}>Full name</label>
          <input id={`${id}-name`} name="name" type="text" autoComplete="name" required />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" required />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-password`}>Password</label>
          <input
            id={`${id}-password`}
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            aria-describedby={`${id}-password-hint`}
            required
          />
          <p id={`${id}-password-hint`} className={styles.hint}>
            At least {MIN_PASSWORD_LENGTH} characters.
          </p>
        </div>
        <div className={styles.check}>
          <input id={`${id}-terms`} name="terms" type="checkbox" required />
          <label htmlFor={`${id}-terms`}>I agree to the terms</label>
        </div>
        <Button type="submit">Create account</Button>
      </form>
    </Dialog>
  );
}
