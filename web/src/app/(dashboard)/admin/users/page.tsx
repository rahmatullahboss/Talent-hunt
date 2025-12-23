import { redirect } from "next/navigation";
import { getCurrentUser, getDBAsync } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleSuspensionButton } from "@/components/admin/toggle-suspension-button";

interface UserRow {
  id: string;
  full_name: string;
  role: string;
  is_suspended: number;
  created_at: string;
  updated_at: string;
}

export default async function AdminUsersPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const d1 = await getDBAsync();
  let users: UserRow[] = [];

  if (d1) {
    try {
      const { results } = await d1
        .prepare(`
          SELECT id, full_name, role, is_suspended, created_at, updated_at
          FROM profiles
          ORDER BY created_at DESC
        `)
        .all<UserRow>();

      users = results ?? [];
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Users</h1>
        <p className="text-sm text-muted">Suspend accounts that violate policy and monitor onboarding progress.</p>
      </div>

      <Card className="overflow-hidden border border-card-border/70 bg-card/80">
        <table className="w-full text-sm">
          <thead className="bg-foreground/5 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-card-border/50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{user.full_name}</p>
                  <p className="text-xs text-muted">ID: {user.id}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="muted">{user.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  {user.is_suspended ? <Badge variant="danger">Suspended</Badge> : <Badge variant="success">Active</Badge>}
                </td>
                <td className="px-4 py-3 text-sm text-muted">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <ToggleSuspensionButton userId={user.id} suspended={!!user.is_suspended} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
