import { useState } from 'react';
import { useApp } from '../store';
import type { Page } from '../types';
import {
  LayoutDashboard, Monitor, Wrench, CalendarCheck, Users, LogOut,
  Menu, X, Bell, ChevronRight, Shield
} from 'lucide-react';

const roleLabels = { admin: 'Administrator', it_tech: 'IT Technician', property_manager: 'Property Manager', staff: 'Staff Member' };
const roleColors = { admin: 'bg-amber-100 text-amber-700', it_tech: 'bg-blue-100 text-blue-700', property_manager: 'bg-green-100 text-green-700', staff: 'bg-purple-100 text-purple-700' };

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, currentPage, setCurrentPage, notifications, isAdmin } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  if (!currentUser) return null;

  const navItems: { page: Page; label: string; icon: React.ReactNode; show: boolean }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, show: true },
    { page: 'it_tickets', label: 'IT Support', icon: <Monitor className="w-5 h-5" />, show: true },
    { page: 'maintenance_tickets', label: 'Maintenance', icon: <Wrench className="w-5 h-5" />, show: true },
    { page: 'cyclical', label: 'MOE Cycles', icon: <CalendarCheck className="w-5 h-5" />, show: currentUser.role !== 'staff' },
    { page: 'users', label: 'User Management', icon: <Users className="w-5 h-5" />, show: isAdmin() },
  ];

  const navigate = (p: Page) => { setCurrentPage(p); setSidebarOpen(false); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-900 text-sm">SchoolCare NZ</span>
          </div>
          <button onClick={() => navigate('notifications')} className="p-2 -mr-2 text-gray-600 hover:text-gray-900 relative transition">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-sm">SchoolCare NZ</h2>
                  <p className="text-[11px] text-gray-400">Property & IT Management</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.filter(i => i.show).map(item => (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentPage === item.page
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {currentPage === item.page && <ChevronRight className="w-4 h-4 text-blue-400" />}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
                <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${roleColors[currentUser.role]}`}>
                  {roleLabels[currentUser.role]}
                </span>
              </div>
            </div>
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-14 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
