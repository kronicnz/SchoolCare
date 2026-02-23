import { AppProvider, useApp } from './store';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ITTickets } from './components/ITTickets';
import { MaintenanceTickets } from './components/MaintenanceTickets';
import { CyclicalMaintenance } from './components/CyclicalMaintenance';
import { UserManagement } from './components/UserManagement';
import { Bell, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

function NotificationsPage() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  if (!currentUser) return null;

  const userNotifs = notifications.filter(n => n.userId === currentUser.id);
  const unread = userNotifs.filter(n => !n.read).length;
  const typeIcon = { info: <Info className="w-4 h-4 text-blue-500" />, warning: <AlertTriangle className="w-4 h-4 text-amber-500" />, success: <CheckCircle className="w-4 h-4 text-green-500" />, error: <XCircle className="w-4 h-4 text-red-500" /> };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-gray-600" /> Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllNotificationsRead} className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl transition">
            <Check className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>
      {userNotifs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No notifications yet</p>
          <p className="text-gray-300 text-xs mt-1">Notifications will appear here when tickets are updated</p>
        </div>
      ) : (
        <div className="space-y-2">
          {userNotifs.map(n => (
            <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`bg-white rounded-xl border p-4 transition cursor-pointer hover:shadow-sm ${n.read ? 'border-gray-100 opacity-60' : 'border-blue-100 bg-blue-50/30'}`}>
              <div className="flex items-start gap-3">
                {typeIcon[n.type]}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('en-NZ')}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AppRouter() {
  const { currentUser, currentPage } = useApp();

  if (!currentUser) return <Login />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'it_tickets': return <ITTickets />;
      case 'maintenance_tickets': return <MaintenanceTickets />;
      case 'cyclical': return currentUser.role !== 'staff' ? <CyclicalMaintenance /> : <Dashboard />;
      case 'users': return currentUser.role === 'admin' ? <UserManagement /> : <Dashboard />;
      case 'notifications': return <NotificationsPage />;
      default: return <Dashboard />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
}

export function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
