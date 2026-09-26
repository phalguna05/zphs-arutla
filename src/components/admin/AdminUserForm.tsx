"use client";

import { useActionState } from "react";
import { addAdminUser } from "@/actions/admin";
import { Corners } from "../Corners";

export function AdminUserForm() {
  const [state, action, pending] = useActionState(addAdminUser, {});
  return (
    <form action={action} className="blueprint admin-form">
      <Corners />
      <h3 className="admin-form-title">Add an admin</h3>
      <label className="field">
        Username
        <input
          className="input"
          name="username"
          defaultValue={state.values?.username}
          placeholder="e.g. office"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
        />
      </label>
      <label className="field">
        Password
        <input className="input" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      <label className="field">
        Confirm password
        <input className="input" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      {state.error && <span className="form-error" role="alert">{state.error}</span>}
      <button type="submit" className="btn btn-primary btn-md blueprint" disabled={pending}>
        Add admin
        <Corners />
      </button>
    </form>
  );
}
