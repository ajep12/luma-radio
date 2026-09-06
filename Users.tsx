import { AdminHeading } from "./AdminHeading";

const placeholderUsers = [
  { name: "Station Owner", email: "owner@lumaradio.example", role: "Admin" },
  { name: "Ade Morgan", email: "ade@lumaradio.example", role: "Presenter" },
];

export function Users() {
  return (
    <div>
      <AdminHeading title="Users" subtitle="Everyone with access to Luma Radio's admin and listener accounts." />
      <div className="overflow-hidden rounded-2xl border border-base-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-base-panel text-ink-faint">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-line">
            {placeholderUsers.map((u) => (
              <tr key={u.email}>
                <td className="px-5 py-3 text-ink">{u.name}</td>
                <td className="px-5 py-3 text-ink-soft">{u.email}</td>
                <td className="px-5 py-3 text-ink-soft">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-ink-faint">
        Placeholder data. Once accounts are connected to Supabase, this list will reflect real
        registered users.
      </p>
    </div>
  );
}
