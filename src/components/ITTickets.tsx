import { useState, useMemo } from 'react';
import { useApp } from '../store';
import { itCategories, locations } from '../data/moeCompliance';
import type { Ticket, TicketPriority, TicketStatus } from '../types';
import { Monitor, Plus, Search, Filter, X, Send, ChevronDown, ChevronUp, ArrowLeft, MessageCircle, Clock, MapPin } from 'lucide-react';

const priorityOptions: TicketPriority[] = ['low', 'medium', 'high', 'critical'];
const statusOptions: TicketStatus[] = ['open', 'in_progress', 'on_hold', 'resolved', 'closed'];
const priorityColor = { low: 'bg-gray-100 text-gray-600', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' };
const statusColor = { open: 'bg-blue-100 text-blue-700', in_progress: 'bg-amber-100 text-amber-700', on_hold: 'bg-gray-200 text-gray-700', resolved: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-500' };
const statusLabel = { open: 'Open', in_progress: 'In Progress', on_hold: 'On Hold', resolved: 'Resolved', closed: 'Closed' };

export function ITTickets() {
  const { currentUser, tickets, users, addTicket, updateTicket, addComment, canManageIT } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPriority, setFormPriority] = useState<TicketPriority>('medium');
  const [formCategory, setFormCategory] = useState(itCategories[0]);
  const [formLocation, setFormLocation] = useState(locations[0]);
  const [formAssignee, setFormAssignee] = useState('');
  const [formDueDate, setFormDueDate] = useState('');

  const itTechs = users.filter(u => u.role === 'it_tech' || u.role === 'admin');
  const itTickets = useMemo(() => {
    let result = tickets.filter(t => t.type === 'it');
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.location.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') result = result.filter(t => t.status === filterStatus);
    if (filterPriority !== 'all') result = result.filter(t => t.priority === filterPriority);
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [tickets, searchQuery, filterStatus, filterPriority]);

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignee = itTechs.find(u => u.id === formAssignee);
    addTicket({
      type: 'it', title: formTitle, description: formDesc, priority: formPriority,
      status: 'open', category: formCategory, location: formLocation,
      createdBy: currentUser.id, createdByName: currentUser.name,
      assignedTo: assignee?.id, assignedToName: assignee?.name,
      dueDate: formDueDate || undefined,
    });
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle(''); setFormDesc(''); setFormPriority('medium');
    setFormCategory(itCategories[0]); setFormLocation(locations[0]);
    setFormAssignee(''); setFormDueDate('');
  };

  const handleComment = (ticketId: string) => {
    if (!commentText.trim()) return;
    addComment(ticketId, commentText);
    setCommentText('');
    const updated = tickets.find(t => t.id === ticketId);
    if (updated) setSelectedTicket({ ...updated, comments: [...updated.comments, { id: '', userId: currentUser.id, userName: currentUser.name, text: commentText, createdAt: new Date().toISOString() }] });
  };

  // Detail View
  if (selectedTicket) {
    const ticket = tickets.find(t => t.id === selectedTicket.id) || selectedTicket;
    return (
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back to IT Tickets
        </button>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColor[ticket.priority]}`}>{ticket.priority}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[ticket.status]}`}>{statusLabel[ticket.status]}</span>
              <span className="text-xs text-gray-400">#{ticket.id.slice(-6)}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ticket.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket.createdAt).toLocaleDateString('en-NZ')}</span>
              <span>Category: {ticket.category}</span>
            </div>
          </div>
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
          </div>
          <div className="p-5 border-b border-gray-100">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div><span className="text-gray-400 text-xs block">Created By</span><span className="font-medium text-gray-800">{ticket.createdByName}</span></div>
              <div><span className="text-gray-400 text-xs block">Assigned To</span><span className="font-medium text-gray-800">{ticket.assignedToName || 'Unassigned'}</span></div>
              <div><span className="text-gray-400 text-xs block">Due Date</span><span className="font-medium text-gray-800">{ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString('en-NZ') : 'Not set'}</span></div>
              <div><span className="text-gray-400 text-xs block">Last Updated</span><span className="font-medium text-gray-800">{new Date(ticket.updatedAt).toLocaleDateString('en-NZ')}</span></div>
            </div>
          </div>

          {/* Status Update for IT techs */}
          {canManageIT() && (
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Update Ticket</h3>
              <div className="flex flex-wrap gap-3">
                <select value={ticket.status} onChange={e => { updateTicket(ticket.id, { status: e.target.value as TicketStatus, resolvedAt: e.target.value === 'resolved' ? new Date().toISOString() : ticket.resolvedAt }); setSelectedTicket({ ...ticket, status: e.target.value as TicketStatus }); }} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {statusOptions.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
                </select>
                <select value={ticket.priority} onChange={e => { updateTicket(ticket.id, { priority: e.target.value as TicketPriority }); setSelectedTicket({ ...ticket, priority: e.target.value as TicketPriority }); }} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={ticket.assignedTo || ''} onChange={e => { const u = itTechs.find(x => x.id === e.target.value); updateTicket(ticket.id, { assignedTo: u?.id, assignedToName: u?.name }); setSelectedTicket({ ...ticket, assignedTo: u?.id, assignedToName: u?.name }); }} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">Unassigned</option>
                  {itTechs.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Comments ({ticket.comments.length})
            </h3>
            <div className="space-y-3 mb-4">
              {ticket.comments.map(c => (
                <div key={c.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700">{c.userName}</span>
                    <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleString('en-NZ')}</span>
                  </div>
                  <p className="text-sm text-gray-600">{c.text}</p>
                </div>
              ))}
              {ticket.comments.length === 0 && <p className="text-xs text-gray-400">No comments yet</p>}
            </div>
            <div className="flex gap-2">
              <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleComment(ticket.id)} placeholder="Add a comment..." className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <button onClick={() => handleComment(ticket.id)} className="px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create Form
  if (showForm) {
    return (
      <div className="p-4 lg:p-8 max-w-2xl mx-auto">
        <button onClick={() => { setShowForm(false); resetForm(); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">New IT Support Ticket</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input value={formTitle} onChange={e => setFormTitle(e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Brief summary of the issue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} required rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" placeholder="Detailed description of the issue..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                  {itCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select value={formPriority} onChange={e => setFormPriority(e.target.value as TicketPriority)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                  {priorityOptions.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select value={formLocation} onChange={e => setFormLocation(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            {canManageIT() && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <select value={formAssignee} onChange={e => setFormAssignee(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                    <option value="">Unassigned</option>
                    {itTechs.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" value={formDueDate} onChange={e => setFormDueDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition text-sm">Create Ticket</button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Monitor className="w-6 h-6 text-blue-600" /> IT Support
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{itTickets.length} ticket{itTickets.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition shadow-sm">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Ticket</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tickets..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm transition ${showFilters ? 'border-blue-300 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <Filter className="w-4 h-4" /> {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
        {showFilters && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="all">All Status</option>
              {statusOptions.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="all">All Priority</option>
              {priorityOptions.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
            {(filterStatus !== 'all' || filterPriority !== 'all') && (
              <button onClick={() => { setFilterStatus('all'); setFilterPriority('all'); }} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Ticket List */}
      <div className="space-y-2">
        {itTickets.map(ticket => (
          <button key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition text-left group">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 mt-2 ${ticket.priority === 'critical' ? 'bg-red-500 animate-pulse' : ticket.priority === 'high' ? 'bg-orange-500' : ticket.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition truncate">{ticket.title}</p>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">#{ticket.id.slice(-6)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ticket.description}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[ticket.status]}`}>{statusLabel[ticket.status]}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityColor[ticket.priority]}`}>{ticket.priority}</span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{ticket.location}</span>
                  {ticket.assignedToName && <span className="text-[10px] text-gray-400">→ {ticket.assignedToName}</span>}
                  {ticket.comments.length > 0 && <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><MessageCircle className="w-2.5 h-2.5" />{ticket.comments.length}</span>}
                </div>
              </div>
            </div>
          </button>
        ))}
        {itTickets.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Monitor className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No IT tickets found</p>
            <button onClick={() => setShowForm(true)} className="mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium transition">Create one →</button>
          </div>
        )}
      </div>
    </div>
  );
}
