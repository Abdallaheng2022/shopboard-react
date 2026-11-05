// RegisterForm.tsx: the sign-up form, shown over the page when the user clicks "Sign up".
// The browser checks the fields (required, email, 8+ characters) before onSubmit runs.
// No sign-up endpoint exists yet, so submitting only tells App the user's name.
import { useState, type FormEvent } from "react";

// The shortest password the form accepts.
const MIN_PASSWORD_LENGTH = 8;

interface RegisterFormProps {
  onRegister: (name: string) => void;
  onClose: () => void;
}

export function RegisterForm({ onRegister, onClose }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    // Stop the browser from reloading the page; React handles the form.
    event.preventDefault();
    onRegister(name);
  }

  return (
    // A click on the dark layer itself (not on the dialog) closes the form.
    <div
      className="overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="register-title">
        <div className="dialog-content">
          <div className="dialog-header">
            <h2 id="register-title" className="dialog-title">
              Create your account
            </h2>
            <button
              type="button"
              className="btn btn-secondary"
              aria-label="Close"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                aria-describedby="password-hint"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <p id="password-hint" className="hint">
                At least {MIN_PASSWORD_LENGTH} characters.
              </p>
            </div>
            <div className="field-check">
              <input
                id="terms"
                type="checkbox"
                required
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
              />
              <label htmlFor="terms">I agree to the terms</label>
            </div>
            <button type="submit" className="btn btn-primary">
              Create account
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
