"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveStaff } from "@/actions/admin";
import type { StaffMember } from "@/db/schema";
import { content } from "@/lib/content";
import { Corners } from "../Corners";

export function StaffForm({ member }: { member?: StaffMember }) {
  const [state, action, pending] = useActionState(saveStaff, {});
  const v = state.values ?? member ?? {};
  const { prefixes } = content.about.faculty;
  return (
    <form action={action} className="blueprint admin-form" key={member?.id ?? "new"}>
      <Corners />
      <h3 className="admin-form-title">{member ? "Edit staff member" : "Add a staff member"}</h3>
      {member && <input type="hidden" name="id" value={member.id} />}
      <div className="form-prefix">
        <label className="field">
          Prefix
          <select className="input" name="prefix" defaultValue={v.prefix ?? prefixes[0]}>
            {prefixes.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
            <option value="">None</option>
          </select>
        </label>
        <label className="field">
          Name
          <input className="input" name="name" defaultValue={v.name} placeholder="e.g. K. Srinivas Reddy" required />
        </label>
      </div>
      <label className="field">
        Designation
        <input className="input" name="designation" defaultValue={v.designation} placeholder="e.g. School Assistant" required />
      </label>
      <label className="field">
        Subject
        <input className="input" name="subject" defaultValue={v.subject} placeholder="e.g. Mathematics" />
      </label>
      {state.error && <span className="form-error" role="alert">{state.error}</span>}
      <button type="submit" className="btn btn-primary btn-md blueprint" disabled={pending}>
        {member ? "Save changes" : "Add staff member"}
        <Corners />
      </button>
      {member && (
        <Link href="/admin?tab=staff" className="small-14 align-center-self">
          Cancel editing
        </Link>
      )}
    </form>
  );
}
