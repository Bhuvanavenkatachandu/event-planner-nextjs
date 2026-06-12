export default function RoleBadge({ role }) {
  return (
    <span className={`badge ${role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
      {role === 'admin' ? '👑 Admin' : '👤 User'}
    </span>
  );
}
