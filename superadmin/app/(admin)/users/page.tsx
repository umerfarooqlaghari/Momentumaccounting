"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAdmin } from "@/components/AdminShell";
import { Badge, Button, Card, ErrorBox, PageHeader, Spinner, formatDate, inputCls } from "@/components/ui";

type User = { _id: string; name: string; email: string; role: string; active: boolean; lastLoginAt?: string };

const ROLES = [
  { key: "owner", label: "Owner — everything, including users" },
  { key: "editor", label: "Editor — website content" },
  { key: "leads", label: "Lead manager — leads & reports" },
];

export default function UsersPage() {
  const { user: me } = useAdmin();
  const [users, setUsers] = useState<User[] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "editor" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pwFor, setPwFor] = useState<string | null>(null);
  const [newPw, setNewPw] = useState("");

  const load = () => api<{ items: User[] }>("admin/users").then((d) => setUsers(d.items)).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  if (me.role !== "owner") return <ErrorBox message="Only owners can manage users." />;

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("admin/users", { method: "POST", json: form });
      setForm({ name: "", email: "", password: "", role: "editor" });
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const update = async (id: string, body: Record<string, unknown>) => {
    setError("");
    try {
      await api(`admin/users/${id}`, { method: "PUT", json: body });
      load();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  return (
    <>
      <PageHeader title="Users" description="Who can sign in to superadmin." />
      {error && <div className="mb-4"><ErrorBox message={error} /></div>}
      {!users ? (
        <Spinner />
      ) : (
        <Card className="mb-8 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-charcoal/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last sign-in</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-5 py-3">
                    <span className="font-semibold">{u.name}</span>
                    <span className="block text-xs text-muted">{u.email}</span>
                  </td>
                  <td className="px-5 py-3">
                    <select aria-label={`Role for ${u.name}`} value={u.role} onChange={(e) => update(u._id, { role: e.target.value })} className={inputCls}>
                      {ROLES.map((r) => <option key={r.key} value={r.key}>{r.key}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3"><Badge value={String(u.active)} label={u.active ? "Active" : "Disabled"} /></td>
                  <td className="px-5 py-3">{formatDate(u.lastLoginAt, true)}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      {pwFor === u._id ? (
                        <>
                          <input type="password" aria-label="New password" placeholder="New password (12+ chars)" value={newPw} onChange={(e) => setNewPw(e.target.value)} className={`${inputCls} w-48`} />
                          <Button variant="dark" onClick={async () => { if (await update(u._id, { password: newPw })) { setPwFor(null); setNewPw(""); } }}>Save</Button>
                        </>
                      ) : (
                        <Button variant="ghost" onClick={() => setPwFor(u._id)}>Set password</Button>
                      )}
                      <Button variant="ghost" onClick={() => update(u._id, { active: !u.active })}>{u.active ? "Disable" : "Enable"}</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Card className="max-w-xl p-6">
        <h2 className="mb-4 font-bold">Add a user</h2>
        <form onSubmit={create} className="space-y-4">
          <input required aria-label="Name" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          <input required type="email" aria-label="Email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
          <input required type="password" minLength={12} aria-label="Temporary password" placeholder="Temporary password (12+ characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} />
          <select aria-label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
            {ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
          <Button type="submit" loading={busy}>Add user</Button>
        </form>
      </Card>
    </>
  );
}
