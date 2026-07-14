'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, FolderOpen, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/roadmaps', label: 'Roadmaps', icon: Map, exact: false },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[var(--bg-surface)] border-r border-[var(--border-soft)] flex flex-col z-40">
      {/* Brand */}
      <div className="p-5 border-b border-[var(--border-soft)]">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-dark)] flex items-center justify-center">
            <span className="text-[var(--accent-primary)] text-xs font-bold">SK</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)] leading-tight">StudentKit</p>
            <p className="text-[10px] text-[var(--text-subtle)] leading-tight">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 mt-2">
        <p className="px-3 mb-2 text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-widest">
          Content
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[var(--border-soft)]">
        <div className="flex items-center gap-3">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[var(--border-soft)]"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[var(--accent-dark)] flex items-center justify-center ring-2 ring-[var(--border-soft)]">
              <span className="text-[var(--accent-primary)] text-xs font-bold">
                {(user?.displayName || user?.email || 'A')[0].toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
              {user?.displayName || user?.email?.split('@')[0]}
            </p>
            <p className="text-[10px] text-[var(--text-subtle)] capitalize">{user?.role}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="p-2 rounded-lg text-[var(--text-subtle)] hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
