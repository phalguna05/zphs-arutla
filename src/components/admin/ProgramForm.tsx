"use client";

import { useActionState } from "react";
import { addProgram } from "@/actions/admin";
import { content } from "@/lib/content";
import { Corners } from "../Corners";

export function ProgramForm({ uploadsEnabled }: { uploadsEnabled: boolean }) {
  const [state, action, pending] = useActionState(addProgram, {});
  const v = state.values ?? {};
  return (
    <form action={action} className="blueprint admin-form">
      <Corners />
      <h3 className="admin-form-title">Add a program</h3>
      <label className="field">
        Program name
        <input className="input" name="name" defaultValue={v.name} placeholder="e.g. Maths Olympiad Club" required />
      </label>
      <div className="form-2 gap-10">
        <label className="field">
          Category
          <select className="input" name="category" defaultValue={v.category ?? content.programs.categories[0]}>
            {content.programs.categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Duration
          <input className="input" name="duration" defaultValue={v.duration} placeholder="Jul – Dec 2026" />
        </label>
      </div>
      <label className="field">
        Coordinator
        <input className="input" name="coordinator" defaultValue={v.coordinator} placeholder="Teacher's name" />
      </label>
      <label className="field">
        Description
        <textarea className="input" name="description" defaultValue={v.description} rows={4} required />
      </label>
      <label className="field">
        Photos (up to 3)
        <input
          className="input file-input"
          name="photos"
          type="file"
          accept="image/*"
          multiple
          disabled={!uploadsEnabled}
        />
        {!uploadsEnabled && <span className="text-soft small-13">Set BLOB_READ_WRITE_TOKEN to enable photo uploads.</span>}
      </label>
      {state.error && <span className="form-error" role="alert">{state.error}</span>}
      <button type="submit" className="btn btn-primary btn-md blueprint" disabled={pending}>
        Publish program
        <Corners />
      </button>
    </form>
  );
}
