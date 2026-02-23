import { useApp } from '../store';
import { Monitor, Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp, ArrowRight, CalendarCheck } from 'lucide-react';

export function Dashboard() {
  const { currentUser, tickets, cycles, setCurrentPage } = useApp();
  if (!currentUser) return null;

  const itTickets = tickets.filter(t => t.type === 'it');
  const maintTickets = tickets.filter(t => t.type === 'maintenance');
  const openIT = itTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const openMaint = maintTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const criticalCount = tickets.filter(t => t.priority === 'critical' && t.status !== 'closed' && t.status !== 'resolved').length;
  const resolvedThisWeek = tickets.filter(t => {
    if (!t.resolvedAt) return false;
    const week = Date.now() - 7 * 86400000;
    return new Date(t.resolvedAt).getTime() > week;
  }).length;

  const totalCycleTasks = cycles.reduce((acc, c) => acc + c.sections.reduce((a, s) => a + s.tasks.length, 0), 0);
  const completedCycleTasks = cycles.reduce((acc, c) => acc + c.sections.reduce((a, s) => a + s.tasks.filter(t => t.completed).length, 0), 0);
  const cycleProgress = totalCycleTasks > 0 ? Math.round((completedCycleTasks / totalCycleTasks) * 100) : 0;

  const recentTickets = [...tickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  const upcomingCycles = cycles.filter(c => {
    const end = new Date(c.currentCycleEnd);
    const daysLeft = (end.getTime() - Date.now()) / 86400000;
    return daysLeft <= 14 && daysLeft > 0;
  });

  const priorityColor = { low: 'text-gray-500 bg-gray-100', medium: 'text-yellow-700 bg-yellow-100', high: 'text-orange-700 bg-orange-100', critical: 'text-red-700 bg-red-100' };
  const statusColor = { open: 'text-blue-700 bg-blue-100', in_progress: 'text-amber-700 bg-amber-100', on_hold: 'text-gray-700 bg-gray-200', resolved: 'text-green-700 bg-green-100', closed: 'text-gray-500 bg-gray-100' };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{greeting()}, {currentUser.name.split(' ')[0]}</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <button onClick={() => setCurrentPage('it_tickets')} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition text-left group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
              <Monitor className="w-5 h-5 text-blue-600" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{openIT}</p>
          <p className="text-xs text-gray-500 mt-0.5">Open IT Tickets</p>
        </button>

        <button onClick={() => setCurrentPage('maintenance_tickets')} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition text-left group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
              <Wrench className="w-5 h-5 text-green-600" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-400 transition" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{openMaint}</p>
          <p className="text-xs text-gray-500 mt-0.5">Open Maintenance</p>
        </button>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">Critical Issues</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{resolvedThisWeek}</p>
          <p className="text-xs text-gray-500 mt-0.5">Resolved This Week</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            <span className="text-xs text-gray-400">{tickets.length} total tickets</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentTickets.map(ticket => (
              <div key={ticket.id} className="px-5 py-3.5 hover:bg-gray-50/50 transition">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ticket.type === 'it' ? 'bg-blue-50' : 'bg-green-50'}`}>
                    {ticket.type === 'it' ? <Monitor className="w-4 h-4 text-blue-500" /> : <Wrench className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${priorityColor[ticket.priority]}`}>{ticket.priority}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusColor[ticket.status]}`}>{ticket.status.replace('_', ' ')}</span>
                      <span className="text-[10px] text-gray-400">{ticket.location}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap mt-1">{formatTimeAgo(ticket.updatedAt)}</span>
                </div>
              </div>
            ))}
            {recentTickets.length === 0 && (
              <div className="px-5 py-12 text-center text-gray-400 text-sm">No tickets yet</div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* MOE Compliance Progress */}
          {currentUser.role !== 'staff' && (
            <button onClick={() => setCurrentPage('cyclical')} className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-semibold text-gray-900 text-sm">MOE Compliance</h3>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition" />
              </div>
              <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${cycleProgress}%` }} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{completedCycleTasks}/{totalCycleTasks} tasks</span>
                <span className="font-semibold text-indigo-600">{cycleProgress}%</span>
              </div>
            </button>
          )}

          {/* Upcoming Cycle Deadlines */}
          {upcomingCycles.length > 0 && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="font-semibold text-amber-900 text-sm">Upcoming Deadlines</h3>
              </div>
              <div className="space-y-2">
                {upcomingCycles.map(c => {
                  const days = Math.ceil((new Date(c.currentCycleEnd).getTime() - Date.now()) / 86400000);
                  return (
                    <div key={c.id} className="flex items-center justify-between">
                      <span className="text-xs text-amber-800 truncate">{c.name}</span>
                      <span className="text-xs font-semibold text-amber-600 whitespace-nowrap ml-2">{days}d left</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" /> Resolution Stats
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">IT Tickets Resolved</span>
                  <span className="font-medium text-gray-700">{itTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}/{itTickets.length}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${itTickets.length > 0 ? (itTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length / itTickets.length) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Maintenance Resolved</span>
                  <span className="font-medium text-gray-700">{maintTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}/{maintTickets.length}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${maintTickets.length > 0 ? (maintTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length / maintTickets.length) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
}
