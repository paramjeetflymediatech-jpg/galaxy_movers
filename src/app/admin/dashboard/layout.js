import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { Truck, Home, Inbox, BookOpen, Settings, LogOut, User } from 'lucide-react';
import SidebarMenu from './SidebarMenu'; // client container for active routes

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  // If no session exists, securely redirect to login
  if (!session) {
    redirect('/admin');
  }

  return (
    <div className="bg-gray-150 min-h-screen flex text-gray-800">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 text-white flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg shadow-red-600/10">
              <Truck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-sm leading-none">
                GALAXY MOVERS
              </span>
              <span className="text-[9px] uppercase font-bold text-red-500 tracking-wider mt-0.5">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <SidebarMenu />
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-6 border-t border-gray-800 bg-gray-950/20 space-y-4">
          <div className="flex items-center space-x-3 text-sm">
            <div className="bg-gray-800 p-2 rounded-lg text-red-500">
              <User className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-extrabold text-xs text-white leading-none truncate">
                {session.email.split('@')[0]}
              </span>
              <span className="text-[10px] text-gray-500 font-bold truncate mt-0.5">
                {session.email}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Main Header bar */}
        <header className="bg-white border-b border-gray-150 h-16 flex items-center justify-between px-6 md:px-8">
          <h2 className="font-extrabold text-lg text-gray-900">
            Console Management
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider bg-gray-50 border border-gray-100 py-1.5 px-3 rounded-full">
              System Admin
            </span>
          </div>
        </header>

        {/* Sub-page content injection */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
