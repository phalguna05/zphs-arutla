"use client";

import { useState, useTransition } from "react";

type RemoveButtonProps = { onConfirm: () => Promise<void>; label?: string; confirmLabel?: string };

export function RemoveButton({ onConfirm, label = "Remove", confirmLabel = "Confirm remove" }: RemoveButtonProps) {
  const [asking, setAsking] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!asking) {
    return (
      <button type="button" className="btn btn-ghost small-13" onClick={() => setAsking(true)}>
        {label}
      </button>
    );
  }
  return (
    <div className="confirm-row">
      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={pending}
        onClick={() => startTransition(() => onConfirm())}
      >
        {confirmLabel}
      </button>
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAsking(false)}>
        Cancel
      </button>
    </div>
  );
}
