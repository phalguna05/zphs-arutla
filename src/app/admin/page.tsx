import type { Metadata } from "next";
import Link from "next/link";
import { moveStaff, removeAdminUser, removeMessage, removeNotice, removeProgram, removeStaff } from "@/actions/admin";
import { signOut } from "@/actions/auth";
import { AdminOnline, AdminVisitorStats } from "@/components/admin/AdminVisitors";
import { AdminUserForm } from "@/components/admin/AdminUserForm";
import { NoticeForm } from "@/components/admin/NoticeForm";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { RemoveButton } from "@/components/admin/RemoveButton";
import { StaffForm } from "@/components/admin/StaffForm";
import { Corners } from "@/components/Corners";
import { ownerUsername, requireAdmin, type Session } from "@/lib/auth";
import { content } from "@/lib/content";
import { getAdminUsers, getCounts, getMessages, getNotices, getPrograms, getStaff, getVisitorStats, isMockData } from "@/lib/data";
import { formatTimestamp, todayISO } from "@/lib/dates";
import { uploadsEnabled } from "@/lib/upload";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

const TABS = [
  { key: "programs", label: "Programs" },
  { key: "notices", label: "Notice board" },
  { key: "staff", label: "Staff" },
  { key: "inbox", label: "Inbox" },
  { key: "admins", label: "Admins" },
] as const;

type Tab = (typeof TABS)[number]["key"];

const DONE_MESSAGES: Record<string, string> = {
  "program-added": "Program published — now live on the Programs page",
  "program-removed": "Program removed from the website",
  "notice-added": "Notice published to the notice board",
  "notice-removed": "Notice removed from the board",
  "message-removed": "Message deleted",
  "staff-added": "Staff member added to the About page",
  "staff-removed": "Staff member removed",
  "staff-updated": "Staff details updated",
  "admin-added": "Admin added — they can sign in now",
  "admin-removed": "Admin removed",
  "admin-self": "You can\u2019t remove the account you are signed in with",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string; done?: string; edit?: string }> }) {
  const session = await requireAdmin();
  const params = await searchParams;
  const tab: Tab = TABS.some((t) => t.key === params.tab) ? (params.tab as Tab) : "programs";
  const toast = params.done ? DONE_MESSAGES[params.done] : undefined;

  const [counts, visitors, adminUsers] = await Promise.all([getCounts(), getVisitorStats(), getAdminUsers()]);
  const tabCounts: Record<Tab, number> = {
    programs: counts.programs,
    notices: counts.notices,
    staff: counts.staff,
    inbox: counts.messages,
    admins: adminUsers.length + (ownerUsername() ? 1 : 0),
  };
  const canUpload = uploadsEnabled();

  return (
    <div className="admin">
      <div className="admin-bar">
        <img src={content.school.icon} alt={content.school.logoAlt} width={32} height={32} className="logo-tile" />
        <span className="admin-bar-title">{content.school.shortName} · Admin</span>
        <span className="small-14 admin-user">Signed in as {session.username}</span>
        <AdminOnline />
        <Link href="/" className="small-14">View site</Link>
        <form action={signOut}>
          <button type="submit" className="link-button small-14">Sign out</button>
        </form>
      </div>

      <div className="admin-body">
        <nav className="admin-tabs" aria-label="Admin sections">
          {TABS.map((t) => (
            <Link key={t.key} href={`/admin?tab=${t.key}`} className="admin-tab" aria-current={t.key === tab ? "page" : undefined}>
              {t.label}
              <span className="admin-tab-count">{tabCounts[t.key]}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-main">
          <div className="blueprint admin-stats">
            <Corners />
            <AdminVisitorStats initial={visitors} />
            <div className="admin-stat">
              <span className="label-sm">Programs live</span>
              <span className="admin-stat-value">{counts.programs}</span>
            </div>
            <div className="admin-stat">
              <span className="label-sm">Notices live</span>
              <span className="admin-stat-value">{counts.notices}</span>
            </div>
            <div className="admin-stat">
              <span className="label-sm">Messages</span>
              <span className="admin-stat-value">{counts.messages}</span>
            </div>
          </div>

          {isMockData() && (
            <div className="demo-note">
              Showing mock data from <code>content/mock-data.json</code>. Changes last until the server restarts. Set{" "}
              <code>DATABASE_URL</code> to use PostgreSQL.
            </div>
          )}

          {toast && <div className="toast" role="status">{toast}</div>}

          {tab === "programs" && <ProgramsTab canUpload={canUpload} />}
          {tab === "notices" && <NoticesTab canUpload={canUpload} />}
          {tab === "staff" && <StaffTab editId={Number(params.edit) || undefined} />}
          {tab === "inbox" && <InboxTab />}
          {tab === "admins" && <AdminsTab session={session} />}
        </div>
      </div>
    </div>
  );
}

async function ProgramsTab({ canUpload }: { canUpload: boolean }) {
  const programs = await getPrograms();
  return (
    <div className="admin-split">
      <div className="stack-14">
        <h2 className="admin-h2">Programs on the website</h2>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="w-52">Program</th>
                <th>Category</th>
                <th>Duration</th>
                <th className="align-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.id}>
                  <td className="strong">{p.name}</td>
                  <td><span className="tag tag-neutral">{p.category}</span></td>
                  <td>{p.duration}</td>
                  <td className="align-right nowrap">
                    <RemoveButton onConfirm={removeProgram.bind(null, p.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ProgramForm uploadsEnabled={canUpload} />
    </div>
  );
}

async function NoticesTab({ canUpload }: { canUpload: boolean }) {
  const notices = await getNotices();
  return (
    <div className="admin-split">
      <div className="stack-14">
        <h2 className="admin-h2">Notices on the board</h2>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th className="w-50">Title</th>
                <th>Category</th>
                <th className="align-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id}>
                  <td className="nowrap">{n.dateLabel}</td>
                  <td className="strong">
                    {n.title}
                    {n.pinned && <span className="tag tag-outline tag-inline">Pinned</span>}
                  </td>
                  <td><span className="tag tag-neutral">{n.category}</span></td>
                  <td className="align-right nowrap">
                    <RemoveButton onConfirm={removeNotice.bind(null, n.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <NoticeForm today={todayISO()} uploadsEnabled={canUpload} />
    </div>
  );
}

async function StaffTab({ editId }: { editId?: number }) {
  const staff = await getStaff();
  const editing = staff.find((m) => m.id === editId);
  return (
    <div className="admin-split">
      <div className="stack-14">
        <h2 className="admin-h2">Staff on the About page</h2>
        <p className="text-soft small-14">Shown on the About page in this order. Use the arrows to move someone up or down.</p>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Subject</th>
                <th className="align-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((m, i) => (
                <tr key={m.id} className={m.id === editing?.id ? "row-editing" : undefined}>
                  <td className="strong">{[m.prefix, m.name].filter(Boolean).join(" ")}</td>
                  <td>{m.designation}</td>
                  <td>{m.subject}</td>
                  <td className="align-right nowrap">
                    <div className="row-actions">
                      <form action={moveStaff.bind(null, m.id, "up")}>
                        <button type="submit" className="btn btn-ghost btn-order" disabled={i === 0} aria-label={`Move ${m.name} up`}>↑</button>
                      </form>
                      <form action={moveStaff.bind(null, m.id, "down")}>
                        <button type="submit" className="btn btn-ghost btn-order" disabled={i === staff.length - 1} aria-label={`Move ${m.name} down`}>↓</button>
                      </form>
                      <Link href={`/admin?tab=staff&edit=${m.id}`} className="btn btn-ghost small-13">Edit</Link>
                      <RemoveButton onConfirm={removeStaff.bind(null, m.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!staff.length && <p className="text-soft small-15">No staff added yet.</p>}
      </div>
      <StaffForm member={editing} />
    </div>
  );
}

async function AdminsTab({ session }: { session: Session }) {
  const users = await getAdminUsers();
  const owner = ownerUsername();
  return (
    <div className="admin-split">
      <div className="stack-14">
        <h2 className="admin-h2">Admin accounts</h2>
        <p className="text-soft small-14">
          Everyone listed here can sign in to this dashboard. The owner account is set with ADMIN_USERNAME and
          ADMIN_PASSWORD in the environment and always works.
        </p>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Added</th>
                <th className="align-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {owner && (
                <tr>
                  <td className="strong">
                    {owner}
                    <span className="tag tag-outline tag-inline">Owner</span>
                    {session.kind === "owner" && <span className="tag tag-accent tag-inline">You</span>}
                  </td>
                  <td className="text-soft">Environment</td>
                  <td />
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="strong">
                    {u.username}
                    {u.username === session.username && <span className="tag tag-accent tag-inline">You</span>}
                  </td>
                  <td>{formatTimestamp(u.createdAt)}</td>
                  <td className="align-right nowrap">
                    {u.username !== session.username && <RemoveButton onConfirm={removeAdminUser.bind(null, u.id)} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AdminUserForm />
    </div>
  );
}

async function InboxTab() {
  const messages = await getMessages();
  return (
    <div className="stack-14">
      <h2 className="admin-h2">Messages from the contact form</h2>
      <div className="inbox">
        {messages.map((m) => (
          <div key={m.id} className="inbox-row">
            <div className="stack-2">
              <span className="strong">{m.name}</span>
              <a href={`mailto:${m.email}`} className="small-13">{m.email}</a>
              {m.phone && <span className="text-soft small-13">{m.phone}</span>}
            </div>
            <div className="stack-4">
              <span className="tag tag-neutral self-start">{m.subject}</span>
              <span className="small-15 pre-wrap">{m.message}</span>
            </div>
            <div className="inbox-side">
              <span className="text-soft small-13">{formatTimestamp(m.createdAt)}</span>
              <RemoveButton label="Delete" confirmLabel="Confirm delete" onConfirm={removeMessage.bind(null, m.id)} />
            </div>
          </div>
        ))}
        {!messages.length && <p className="text-soft small-15 pad-top-16">No messages yet.</p>}
      </div>
    </div>
  );
}
