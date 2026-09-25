"use client";

import { useActionState, useState } from "react";
import { sendMessage, type ContactState } from "@/actions/contact";
import { content } from "@/lib/content";
import { Corners } from "./Corners";
import { CheckCircleIcon } from "./Icons";

const initial: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);
  const [dismissedAt, setDismissedAt] = useState<ContactState | null>(null);
  const { contact } = content;
  const { fields } = contact;
  const sent = state.status === "sent" && dismissedAt !== state;
  const v = state.values ?? {};

  if (sent) {
    return (
      <div className="stack-14 contact-sent">
        <CheckCircleIcon className="accent-stroke" />
        <h2 className="display-sm">{contact.success.title}</h2>
        <p className="lead-16">{contact.success.text}</p>
        <div>
          <button type="button" className="btn btn-secondary" onClick={() => setDismissedAt(state)}>
            {contact.success.againLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="stack-16" key={dismissedAt ? "again" : "first"}>
      <p className="text-soft small-15">{contact.intro}</p>
      <div className="form-2">
        <label className="field">
          {fields.name.label}
          <input className="input" name="name" defaultValue={v.name} placeholder={fields.name.placeholder} required autoComplete="name" />
        </label>
        <label className="field">
          {fields.phone.label}
          <input className="input" name="phone" type="tel" defaultValue={v.phone} placeholder={fields.phone.placeholder} autoComplete="tel" />
        </label>
      </div>
      <label className="field">
        {fields.email.label}
        <input className="input" name="email" type="email" defaultValue={v.email} placeholder={fields.email.placeholder} required autoComplete="email" />
      </label>
      <label className="field">
        {fields.subject.label}
        <select className="input" name="subject" defaultValue={v.subject ?? contact.subjects[0]}>
          {contact.subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="field">
        {fields.message.label}
        <textarea className="input" name="message" rows={6} defaultValue={v.message} placeholder={fields.message.placeholder} required />
      </label>
      {state.status === "error" && <span className="form-error" role="alert">{state.error}</span>}
      <div>
        <button type="submit" className="btn btn-primary btn-lg blueprint" disabled={pending}>
          {contact.submitLabel}
          <Corners />
        </button>
      </div>
    </form>
  );
}
