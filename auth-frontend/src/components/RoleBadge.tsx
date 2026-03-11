interface RoleBadgeProps {
  role: string;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const isAdmin = role === 'ADMIN';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${isAdmin
          ? 'bg-red-100 text-red-800 ring-1 ring-red-200'
          : 'bg-blue-100 text-blue-800 ring-1 ring-blue-200'
        }`}
    >
      {isAdmin ? '🔴' : '🔵'} {role}
    </span>
  );
}
