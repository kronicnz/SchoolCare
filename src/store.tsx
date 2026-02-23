import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, Ticket, MaintenanceCycle, Notification, Page } from './types';
import { defaultCycles } from './data/moeCompliance';

const genId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

// Default users
const defaultUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@school.nz', password: 'admin123', role: 'admin', active: true, createdAt: new Date().toISOString() },
  { id: 'u2', name: 'Sarah Tech', email: 'sarah@school.nz', password: 'tech123', role: 'it_tech', active: true, createdAt: new Date().toISOString() },
  { id: 'u3', name: 'Mike Property', email: 'mike@school.nz', password: 'prop123', role: 'property_manager', active: true, createdAt: new Date().toISOString() },
  { id: 'u4', name: 'Jane Staff', email: 'jane@school.nz', password: 'staff123', role: 'staff', active: true, createdAt: new Date().toISOString() },
];

// Sample tickets
const sampleTickets: Ticket[] = [
  {
    id: genId(), type: 'it', title: 'Laptop not connecting to WiFi', description: 'Teacher laptop in Room B3 cannot connect to the school WiFi network. Shows "No networks available".', priority: 'high', status: 'open',
    category: 'Network - WiFi', location: 'Block B - Junior School', createdBy: 'u4', createdByName: 'Jane Staff', assignedTo: 'u2', assignedToName: 'Sarah Tech',
    comments: [{ id: genId(), userId: 'u2', userName: 'Sarah Tech', text: 'Will check the access point in Block B.', createdAt: new Date(Date.now() - 3600000).toISOString() }],
    createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 3600000).toISOString(), attachmentCount: 0
  },
  {
    id: genId(), type: 'it', title: 'Interactive display flickering', description: 'The interactive display in the Science Lab flickers intermittently during use.', priority: 'medium', status: 'in_progress',
    category: 'Hardware - Interactive Display', location: 'Block D - Science Labs', createdBy: 'u4', createdByName: 'Jane Staff', assignedTo: 'u2', assignedToName: 'Sarah Tech',
    comments: [], createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(), attachmentCount: 1
  },
  {
    id: genId(), type: 'maintenance', title: 'Leaking tap in staffroom', description: 'The kitchen tap in the staffroom is dripping constantly. Water pooling on the bench.', priority: 'medium', status: 'open',
    category: 'Plumbing', location: 'Staffroom', createdBy: 'u4', createdByName: 'Jane Staff', assignedTo: 'u3', assignedToName: 'Mike Property',
    comments: [], createdAt: new Date(Date.now() - 259200000).toISOString(), updatedAt: new Date(Date.now() - 259200000).toISOString(), attachmentCount: 0
  },
  {
    id: genId(), type: 'maintenance', title: 'Broken window latch Block C Room 5', description: 'Window latch is broken and window cannot be secured. Security concern.', priority: 'high', status: 'in_progress',
    category: 'Windows & Doors', location: 'Block C - Senior School', createdBy: 'u4', createdByName: 'Jane Staff', assignedTo: 'u3', assignedToName: 'Mike Property',
    comments: [{ id: genId(), userId: 'u3', userName: 'Mike Property', text: 'Ordered replacement latch. ETA 2 days.', createdAt: new Date(Date.now() - 43200000).toISOString() }],
    createdAt: new Date(Date.now() - 345600000).toISOString(), updatedAt: new Date(Date.now() - 43200000).toISOString(), attachmentCount: 0
  },
  {
    id: genId(), type: 'it', title: 'Printer jam in Admin office', description: 'Main office printer keeps jamming on every print job.', priority: 'low', status: 'resolved',
    category: 'Hardware - Printer/Scanner', location: 'Block A - Administration', createdBy: 'u1', createdByName: 'Admin User', assignedTo: 'u2', assignedToName: 'Sarah Tech',
    comments: [], createdAt: new Date(Date.now() - 604800000).toISOString(), updatedAt: new Date(Date.now() - 432000000).toISOString(), resolvedAt: new Date(Date.now() - 432000000).toISOString(), attachmentCount: 0
  },
  {
    id: genId(), type: 'maintenance', title: 'Playground swing chain worn', description: 'Junior playground swing has a visibly worn chain link that needs replacing before it breaks. Safety hazard.', priority: 'critical', status: 'open',
    category: 'Playground Equipment', location: 'Playground - Junior', createdBy: 'u3', createdByName: 'Mike Property',
    comments: [], createdAt: new Date(Date.now() - 7200000).toISOString(), updatedAt: new Date(Date.now() - 7200000).toISOString(), attachmentCount: 2
  },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return fallback;
}

function saveToStorage(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

interface AppState {
  currentUser: User | null;
  users: User[];
  tickets: Ticket[];
  cycles: MaintenanceCycle[];
  notifications: Notification[];
  currentPage: Page;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setCurrentPage: (p: Page) => void;
  addTicket: (t: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachmentCount'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  addComment: (ticketId: string, text: string) => void;
  addUser: (u: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleTask: (cycleId: string, sectionId: string, taskId: string) => void;
  rolloverCycle: (cycleId: string) => void;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  canManageIT: () => boolean;
  canManageMaintenance: () => boolean;
  isAdmin: () => boolean;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('app_users', defaultUsers));
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage('app_current_user', null));
  const [tickets, setTickets] = useState<Ticket[]>(() => loadFromStorage('app_tickets', sampleTickets));
  const [cycles, setCycles] = useState<MaintenanceCycle[]>(() => loadFromStorage('app_cycles', defaultCycles));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage('app_notifications', []));
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  useEffect(() => { saveToStorage('app_users', users); }, [users]);
  useEffect(() => { saveToStorage('app_current_user', currentUser); }, [currentUser]);
  useEffect(() => { saveToStorage('app_tickets', tickets); }, [tickets]);
  useEffect(() => { saveToStorage('app_cycles', cycles); }, [cycles]);
  useEffect(() => { saveToStorage('app_notifications', notifications); }, [notifications]);

  const login = useCallback((email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password && u.active);
    if (user) { setCurrentUser(user); setCurrentPage('dashboard'); return true; }
    return false;
  }, [users]);

  const logout = useCallback(() => { setCurrentUser(null); setCurrentPage('dashboard'); }, []);

  const canManageIT = useCallback(() => {
    return currentUser?.role === 'admin' || currentUser?.role === 'it_tech';
  }, [currentUser]);

  const canManageMaintenance = useCallback(() => {
    return currentUser?.role === 'admin' || currentUser?.role === 'property_manager';
  }, [currentUser]);

  const isAdmin = useCallback(() => currentUser?.role === 'admin', [currentUser]);

  const addTicket = useCallback((t: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachmentCount'>) => {
    const now = new Date().toISOString();
    const newTicket: Ticket = { ...t, id: genId(), createdAt: now, updatedAt: now, comments: [], attachmentCount: 0 };
    setTickets(prev => [newTicket, ...prev]);
  }, []);

  const updateTicket = useCallback((id: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  }, []);

  const addComment = useCallback((ticketId: string, text: string) => {
    if (!currentUser) return;
    const comment = { id: genId(), userId: currentUser.id, userName: currentUser.name, text, createdAt: new Date().toISOString() };
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, comments: [...t.comments, comment], updatedAt: new Date().toISOString() } : t));
  }, [currentUser]);

  const addUser = useCallback((u: Omit<User, 'id' | 'createdAt'>) => {
    setUsers(prev => [...prev, { ...u, id: genId(), createdAt: new Date().toISOString() }]);
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : prev);
    }
  }, [currentUser]);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const toggleTask = useCallback((cycleId: string, sectionId: string, taskId: string) => {
    if (!currentUser) return;
    setCycles(prev => prev.map(c => {
      if (c.id !== cycleId) return c;
      return {
        ...c,
        sections: c.sections.map(s => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            tasks: s.tasks.map(t => {
              if (t.id !== taskId) return t;
              return {
                ...t,
                completed: !t.completed,
                completedBy: !t.completed ? currentUser.name : undefined,
                completedAt: !t.completed ? new Date().toISOString() : undefined,
              };
            })
          };
        })
      };
    }));
  }, [currentUser]);

  const rolloverCycle = useCallback((cycleId: string) => {
    setCycles(prev => prev.map(c => {
      if (c.id !== cycleId) return c;
      const now = new Date();
      const nextEnd = new Date(now);
      switch (c.frequency) {
        case 'weekly': nextEnd.setDate(nextEnd.getDate() + 7); break;
        case 'monthly': nextEnd.setMonth(nextEnd.getMonth() + 1); break;
        case 'quarterly': nextEnd.setMonth(nextEnd.getMonth() + 3); break;
        case 'biannual': nextEnd.setMonth(nextEnd.getMonth() + 6); break;
        case 'annual': nextEnd.setFullYear(nextEnd.getFullYear() + 1); break;
        case '5yearly': nextEnd.setFullYear(nextEnd.getFullYear() + 5); break;
        case '10yearly': nextEnd.setFullYear(nextEnd.getFullYear() + 10); break;
      }
      return {
        ...c,
        cycleNumber: c.cycleNumber + 1,
        currentCycleStart: now.toISOString(),
        currentCycleEnd: nextEnd.toISOString(),
        lastRollover: now.toISOString(),
        sections: c.sections.map(s => ({
          ...s,
          tasks: s.tasks.map(t => ({
            ...t,
            completed: false,
            completedBy: undefined,
            completedAt: undefined,
            notes: undefined,
          }))
        }))
      };
    }));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications(prev => [{ ...n, id: genId(), createdAt: new Date().toISOString(), read: false }, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, users, tickets, cycles, notifications, currentPage,
      login, logout, setCurrentPage, addTicket, updateTicket, addComment,
      addUser, updateUser, deleteUser, toggleTask, rolloverCycle,
      addNotification, markNotificationRead, markAllNotificationsRead,
      canManageIT, canManageMaintenance, isAdmin,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
