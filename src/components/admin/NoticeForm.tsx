"use client";

import { useActionState, useState } from "react";
import { addNotice } from "@/actions/admin";
import { content } from "@/lib/content";
import { Corners } from "../Corners";
import { ClipIcon } from "../Icons";

export function NoticeForm({ today, uploadsEnabled }: { today: string; uploadsEnabled: boolean }) {
  const [state, action, pending] = useActionState(addNotice, {});
  const v = state.values ?? {};
  const [fileName, setFileName] = useState("");
  return (
    <form action={action} className="blueprint admin-form">
      <Corners />
      <h3 className="admin-form-title">Post a notice</h3>
      <label className="field">
        Title
        <input className="input" name="title" defaultValue={v.title} placeholder="e.g. School closed on account of rain" required />
      </label>
      <div className="form-2 gap-10">
        <label className="field">
          Category
          <select className="input" name="category" defaultValue={v.category ?? content.notices.categories[0]}>
            {content.notices.categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Date
          <input className="input" name="date" type="date" defaultValue={v.date ?? today} />
        </label>
      </div>
      <label className="field">
        Details
        <textarea className="input" name="body" defaultValue={v.body} rows={5} required />
      </label>
      <label className="btn btn-secondary file-button" aria-disabled={!uploadsEnabled}>
        <ClipIcon />
        {fileName || "Attach circular (PDF)"}
        <input
          name="attachment"
          type="file"
          accept="application/pdf"
          disabled={!uploadsEnabled}
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        />
      </label>
      <label className="checkbox">
        <input type="checkbox" name="pinned" defaultChecked={v.pinned === "on"} />
        Pin to top of the board
      </label>
      {state.error && <span className="form-error" role="alert">{state.error}</span>}
      <button type="submit" className="btn btn-primary btn-md blueprint" disabled={pending}>
        Publish notice
        <Corners />
      </button>
    </form>
  );
}
