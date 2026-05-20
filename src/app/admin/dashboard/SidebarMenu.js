'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, Settings, LogOut, Calendar, Briefcase, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function SidebarMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: <Home className="h-4.5 w-4.5" /> },
    { name: 'Appointments', href: '/admin/dashboard/appointments', icon: <Calendar className="h-4.5 w-4.5" /> },
    { name: 'States & Districts', href: '/admin/dashboard/locations', icon: <MapPin className="h-4.5 w-4.5" /> },
    { name: 'Manage Services', href: '/admin/dashboard/services', icon: <Briefcase className="h-4.5 w-4.5" /> },
    { name: 'Manage Blogs', href: '/admin/dashboard/blogs', icon: <BookOpen className="h-4.5 w-4.5" /> },
    { name: 'SEO Settings', href: '/admin/dashboard/seo', icon: <Settings className="h-4.5 w-4.5" /> }
  ];

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out of the admin panel?')) {
      setIsLoggingOut(true);
      try {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
          router.push('/admin');
        }
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <nav className="space-y-1.5 flex-grow">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isActive
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/10'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        );
      })}
      
      {/* Logout button */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        type="button"
        className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl font-semibold text-sm text-gray-400 hover:bg-red-950/20 hover:text-red-400 transition-all duration-200 mt-6 cursor-pointer text-left"
      >
        <LogOut className="h-4.5 w-4.5 shrink-0" />
        <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
      </button>
    </nav>
  );
}
