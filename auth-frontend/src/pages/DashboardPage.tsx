import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contentApi } from '../api/authApi';
import RoleBadge from '../components/RoleBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { ContentResponse } from '../types/auth';

// ─── Content Card ─────────────────────────────────────────────────────────────
interface ContentCardProps {
  title: string;
  emoji: string;
  colorClass: string;
  children: React.ReactNode;
}

function ContentCard({ title, emoji, colorClass, children }: ContentCardProps) {
  return (
    <div className={`rounded-2xl border p-6 transition-all duration-200 ${colorClass}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  // ── Public content (no auth needed)
  const publicQuery = useQuery<ContentResponse>({
    queryKey: ['public-content'],
    queryFn: contentApi.getPublic,
    staleTime: Infinity,
  });

  // ── User content (USER + ADMIN)
  const userQuery = useQuery<ContentResponse>({
    queryKey: ['user-content'],
    queryFn: contentApi.getUserContent,
    retry: false,
  });

  // ── Admin content (ADMIN only — API call never made for USER)
  const adminQuery = useQuery<ContentResponse>({
    queryKey: ['admin-content'],
    queryFn: contentApi.getAdminContent,
    enabled: isAdmin,
    retry: false,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 leading-none">{user?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
            </div>
            <div className="ml-2">
              <RoleBadge role={user?.role ?? ''} />
            </div>
          </div>

          <button onClick={handleLogout} className="btn-danger text-sm px-4 py-2">
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            You are signed in as <strong>{user?.role}</strong>. Content visible to you is shown below.
          </p>
        </div>

        {/* ── Access Summary — tiles only for what this role can see ── */}
        <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-8`}>
          {[
            { label: 'Public', icon: '🌐' },
            { label: 'User', icon: '👤' },
            ...(isAdmin ? [{ label: 'Admin', icon: '🔴' }] : []),
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-4 text-center border bg-green-50 border-green-200 text-green-700"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs mt-1">✅ Allowed</div>
            </div>
          ))}
        </div>

        {/* ── Content Cards ────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Public — visible to everyone */}
          <ContentCard
            title="Public Content"
            emoji="🌐"
            colorClass="bg-green-50 border-green-200"
          >
            {publicQuery.isLoading ? (
              <LoadingSpinner size="sm" message="Loading..." />
            ) : publicQuery.error ? (
              <p className="text-red-500 text-sm">Failed to load content.</p>
            ) : (
              <div>
                <p className="text-gray-700">{publicQuery.data?.message}</p>
                <span className="inline-block mt-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                  Access: {publicQuery.data?.access}
                </span>
              </div>
            )}
          </ContentCard>

          {/* User Content — visible to USER and ADMIN */}
          <ContentCard
            title="User Content"
            emoji="👤"
            colorClass="bg-blue-50 border-blue-200"
          >
            {userQuery.isLoading ? (
              <LoadingSpinner size="sm" message="Loading..." />
            ) : userQuery.error ? (
              <p className="text-red-500 text-sm">Failed to load content.</p>
            ) : (
              <div>
                <p className="text-gray-700">{userQuery.data?.message}</p>
                <span className="inline-block mt-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  Access: {userQuery.data?.access}
                </span>
              </div>
            )}
          </ContentCard>

          {/* Admin Content — completely hidden for USER role */}
          {isAdmin && (
            <ContentCard
              title="Admin Content"
              emoji="🔴"
              colorClass="bg-red-50 border-red-200"
            >
              {adminQuery.isLoading ? (
                <LoadingSpinner size="sm" message="Loading..." />
              ) : adminQuery.error ? (
                <p className="text-red-500 text-sm">Failed to load admin content.</p>
              ) : (
                <div>
                  <p className="text-gray-700">{adminQuery.data?.message}</p>
                  <span className="inline-block mt-2 text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                    Access: {adminQuery.data?.access}
                  </span>
                </div>
              )}
            </ContentCard>
          )}

        </div>

        

      </main>
    </div>
  );
}