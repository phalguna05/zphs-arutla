"use client";

import { useState, useTransition } from "react";

export function RemoveButton({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const [asking, setAsking] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!asking) {
    return (
      <button type="button" className="btn btn-ghost small-13" onClick={() => setAsking(true)}>
        Remove
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
        Confirm remove
      </button>
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAsking(false)}>
        Cancel
      </button>
    </div>
  );
}
