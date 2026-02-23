import { useState } from 'react';
import { useApp } from '../store';
import type { UserRole } from '../types';
import { Users, Plus, Edit3, Trash2, X, Shield, Monitor, Wrench, User, Search, Check } from 'lucide-react';

const roleLabels: Record<UserRole, string> = { admin: 'Administrator', it_tech: 'IT Technician', property_manager: 'Property Manager', staff: 'Staff Member' };
const roleIcons: Record<UserRole, React.ReactNode> = { admin: <Shield className="w-4 h-4" />, it_tech: <Monitor className="w-4 h-4" />, property_manager: <Wrench className="w-4 h-4" />, staff: <User className="w-4 h-4" /> };
const roleColors: Record<UserRole, string> = { admin: 'bg-amber-100 text-amber-700', it_tech: 'bg-blue-100 text-blue-700', property_manager: 'bg-green-100 text-green-700', staff: 'bg-purple-100 text-purple-700' };

export function UserManagement() {
  const { users, currentUser, addUser, updateUser, deleteUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('staff');
  const [formActive, setFormActive] = useState(true);

  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || roleLabels[u.role].toLowerCase().includes(q);
  });

  const resetForm = () => {
    setFormName(''); setFormEmail(''); setFormPassword(''); setFormRole('staff'); setFormActive(true);
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    setFormName(user.name); setFormEmail(user.email); setFormPassword('');
    setFormRole(user.role); setFormActive(user.active);
    setEditingId(userId); setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updates: Record<string, unknown> = { name: formName, email: formEmail, role: formRole, active: formActive };
      if (formPassword) updates.password = formPassword;
      updateUser(editingId, updates);
    } else {
      addUser({ name: formName, email: formEmail, password: formPassword || 'password123', role: formRole, active: formActive });
    }
    resetForm();
  };

  const handleDelete = (userId: string) => {
    if (userId === currentUser?.id) return;
    deleteUser(userId);
    setDeleteConfirm(null);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-600" /> User Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition shadow-sm">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add User</span>
        </button>
      </div>

      {/* Role Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {(['admin', 'it_tech', 'property_manager', 'staff'] as UserRole[]).map(role => (
          <div key={role} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${roleColors[role]}`}>
              {roleIcons[role]}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{users.filter(u => u.role === role).length}</p>
              <p className="text-[10px] text-gray-500">{roleLabels[role]}s</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400" />
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={resetForm}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={resetForm} className="p-1 text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input value={formName} onChange={e => setFormName(e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{editingId ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                <input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} required={!editingId} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['admin', 'it_tech', 'property_manager', 'staff'] as UserRole[]).map(role => (
                    <button key={role} type="button" onClick={() => setFormRole(role)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition border ${formRole === role ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {roleIcons[role]} {roleLabels[role]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setFormActive(!formActive)} className={`w-10 h-6 rounded-full transition-all ${formActive ? 'bg-green-500' : 'bg-gray-300'} relative`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${formActive ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
                <span className="text-sm text-gray-700">Active Account</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition text-sm">{editingId ? 'Save Changes' : 'Create User'}</button>
                <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="space-y-2">
        {filteredUsers.map(user => (
          <div key={user.id} className={`bg-white rounded-xl border shadow-sm p-4 transition ${!user.active ? 'opacity-60 border-gray-200' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-semibold text-sm ${roleColors[user.role]}`}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  {user.id === currentUser?.id && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full font-medium">You</span>}
                  {!user.active && <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">Inactive</span>}
                </div>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${roleColors[user.role]}`}>{roleLabels[user.role]}</span>
                  {user.active && <span className="flex items-center gap-0.5 text-[10px] text-green-500"><Check className="w-2.5 h-2.5" />Active</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(user.id)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition">
                  <Edit3 className="w-4 h-4" />
                </button>
                {user.id !== currentUser?.id && (
                  deleteConfirm === user.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(user.id)} className="px-2 py-1 bg-red-500 text-white rounded-lg text-[10px] font-medium hover:bg-red-600 transition">Delete</button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 border border-gray-200 text-gray-500 rounded-lg text-[10px] font-medium hover:bg-gray-50 transition">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(user.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
