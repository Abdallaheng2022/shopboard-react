// StatusMessage.tsx: the box for loading, error, empty and "no match" messages.
interface StatusMessageProps {
  message: string;
  // Only for errors: shows a "Try again" button.
  onRetry?: () => void;
}

export function StatusMessage({ message, onRetry }: StatusMessageProps) {
  return (
    <div className="status" role="status">
      <p>{message}</p>
      {onRetry !== undefined && (
        <button type="button" className="button-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
