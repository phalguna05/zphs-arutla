"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/actions/auth";
import { content } from "@/lib/content";
import { Corners } from "../Corners";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, {} as SignInState);
  const { admin } = content;
  return (
    <form action={action} className="stack-14">
      <label className="field">
        {admin.usernameLabel}
        <input className="input" name="username" autoComplete="username" defaultValue={state.username} required />
      </label>
      <label className="field">
        {admin.passwordLabel}
        <input className="input" name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.error && <span className="form-error" role="alert">{state.error}</span>}
      <button type="submit" className="btn btn-primary btn-lg blueprint" disabled={pending}>
        {admin.signInLabel}
        <Corners />
      </button>
      <span className="text-soft small-13">{admin.forgotText}</span>
    </form>
  );
}
