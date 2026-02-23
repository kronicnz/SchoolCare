import { useState } from 'react';
import { useApp } from '../store';
import type { CycleFrequency } from '../types';
import { CalendarCheck, ChevronDown, ChevronRight, CheckCircle2, Circle, RotateCcw, Clock, AlertTriangle, BookOpen, Shield } from 'lucide-react';

const freqLabel: Record<CycleFrequency, string> = { weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', biannual: 'Biannual', annual: 'Annual', '5yearly': '5-Yearly', '10yearly': '10-Yearly' };
const freqColor: Record<CycleFrequency, string> = { weekly: 'bg-blue-100 text-blue-700 border-blue-200', monthly: 'bg-purple-100 text-purple-700 border-purple-200', quarterly: 'bg-indigo-100 text-indigo-700 border-indigo-200', biannual: 'bg-teal-100 text-teal-700 border-teal-200', annual: 'bg-amber-100 text-amber-700 border-amber-200', '5yearly': 'bg-rose-100 text-rose-700 border-rose-200', '10yearly': 'bg-emerald-100 text-emerald-700 border-emerald-200' };

export function CyclicalMaintenance() {
  const { currentUser, cycles, toggleTask, rolloverCycle, canManageMaintenance, isAdmin } = useApp();
  const [expandedCycles, setExpandedCycles] = useState<Set<string>>(new Set(cycles.map(c => c.id)));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [filterFreq, setFilterFreq] = useState<string>('all');
  const [showRolloverConfirm, setShowRolloverConfirm] = useState<string | null>(null);

  if (!currentUser) return null;
  const canEdit = canManageMaintenance() || isAdmin();

  const toggleCycle = (id: string) => {
    setExpandedCycles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleRollover = (cycleId: string) => {
    rolloverCycle(cycleId);
    setShowRolloverConfirm(null);
  };

  const filteredCycles = filterFreq === 'all' ? cycles : cycles.filter(c => c.frequency === filterFreq);

  const totalTasks = cycles.reduce((a, c) => a + c.sections.reduce((b, s) => b + s.tasks.length, 0), 0);
  const completedTasks = cycles.reduce((a, c) => a + c.sections.reduce((b, s) => b + s.tasks.filter(t => t.completed).length, 0), 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueCycles = cycles.filter(c => new Date(c.currentCycleEnd).getTime() < Date.now());

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-indigo-600" /> MOE Cyclical Maintenance
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">NZ Ministry of Education compliant maintenance schedules</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-medium text-gray-500">Overall Progress</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
            <span className="text-xs text-gray-400 mb-1">{completedTasks}/{totalTasks}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarCheck className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-gray-500">Active Cycles</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{cycles.length}</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-gray-500">Completed</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{completedTasks}</span>
        </div>

        <div className={`rounded-2xl border shadow-sm p-4 ${overdueCycles.length > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`w-4 h-4 ${overdueCycles.length > 0 ? 'text-red-500' : 'text-gray-400'}`} />
            <span className="text-xs font-medium text-gray-500">Overdue</span>
          </div>
          <span className={`text-2xl font-bold ${overdueCycles.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>{overdueCycles.length}</span>
        </div>
      </div>

      {/* MOE Reference Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-4 mb-6">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-indigo-900">NZ Ministry of Education Compliance</h3>
            <p className="text-xs text-indigo-600 mt-1">These maintenance cycles align with MOE School Property Guide requirements including 10-Year Property Plans (10YPP), 5-Year Agreements (5YA), Building Warrant of Fitness (BWOF), and Health & Safety compliance standards.</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilterFreq('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterFreq === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
        {Object.entries(freqLabel).map(([key, label]) => (
          <button key={key} onClick={() => setFilterFreq(key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterFreq === key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{label}</button>
        ))}
      </div>

      {/* Cycles */}
      <div className="space-y-4">
        {filteredCycles.map(cycle => {
          const cycleTasks = cycle.sections.reduce((a, s) => a + s.tasks.length, 0);
          const cycleCompleted = cycle.sections.reduce((a, s) => a + s.tasks.filter(t => t.completed).length, 0);
          const cycleProgress = cycleTasks > 0 ? Math.round((cycleCompleted / cycleTasks) * 100) : 0;
          const isExpanded = expandedCycles.has(cycle.id);
          const daysLeft = Math.ceil((new Date(cycle.currentCycleEnd).getTime() - Date.now()) / 86400000);
          const isOverdue = daysLeft < 0;

          return (
            <div key={cycle.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isOverdue ? 'border-red-200' : 'border-gray-100'}`}>
              {/* Cycle Header */}
              <button onClick={() => toggleCycle(cycle.id)} className="w-full p-4 lg:p-5 text-left hover:bg-gray-50/50 transition">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{cycle.name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${freqColor[cycle.frequency]}`}>{freqLabel[cycle.frequency]}</span>
                      {isOverdue && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 animate-pulse">OVERDUE</span>}
                    </div>
                    {cycle.moeReference && <p className="text-xs text-gray-400 mb-2">📋 {cycle.moeReference}</p>}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-xs">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${cycleProgress === 100 ? 'bg-green-500' : isOverdue ? 'bg-red-400' : 'bg-indigo-500'}`} style={{ width: `${cycleProgress}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500">{cycleCompleted}/{cycleTasks} tasks</span>
                      <span className={`text-xs font-medium flex items-center gap-1 ${isOverdue ? 'text-red-500' : daysLeft <= 7 ? 'text-amber-500' : 'text-gray-400'}`}>
                        <Clock className="w-3 h-3" />
                        {isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {/* Cycle Info */}
                  <div className="px-5 py-3 bg-gray-50/50 flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>Cycle #{cycle.cycleNumber}</span>
                    <span>Started: {new Date(cycle.currentCycleStart).toLocaleDateString('en-NZ')}</span>
                    <span>Due: {new Date(cycle.currentCycleEnd).toLocaleDateString('en-NZ')}</span>
                    {cycle.lastRollover && <span>Last rollover: {new Date(cycle.lastRollover).toLocaleDateString('en-NZ')}</span>}
                  </div>

                  {/* Sections */}
                  {cycle.sections.map(section => {
                    const sectionCompleted = section.tasks.filter(t => t.completed).length;
                    const sectionTotal = section.tasks.length;
                    const sectionExpanded = expandedSections.has(section.id);

                    return (
                      <div key={section.id} className="border-t border-gray-100">
                        <button onClick={() => toggleSection(section.id)} className="w-full px-5 py-3 text-left hover:bg-gray-50/50 transition flex items-center gap-3">
                          {sectionExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800">{section.title}</span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full">{section.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-medium ${sectionCompleted === sectionTotal ? 'text-green-500' : 'text-gray-400'}`}>
                                {sectionCompleted}/{sectionTotal}
                              </span>
                              {sectionCompleted === sectionTotal && sectionTotal > 0 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            </div>
                          </div>
                        </button>

                        {sectionExpanded && (
                          <div className="px-5 pb-3 space-y-1">
                            {section.tasks.map(task => (
                              <div key={task.id} className={`flex items-start gap-3 p-3 rounded-xl transition ${task.completed ? 'bg-green-50/50' : 'bg-gray-50/50 hover:bg-gray-50'}`}>
                                <button
                                  onClick={() => canEdit && toggleTask(cycle.id, section.id, task.id)}
                                  disabled={!canEdit}
                                  className={`mt-0.5 flex-shrink-0 transition ${canEdit ? 'cursor-pointer' : 'cursor-default'}`}
                                >
                                  {task.completed
                                    ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    : <Circle className="w-5 h-5 text-gray-300 hover:text-indigo-400" />
                                  }
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{task.description}</p>
                                  {task.completed && task.completedBy && (
                                    <p className="text-[10px] text-green-500 mt-1">
                                      ✓ Completed by {task.completedBy} on {task.completedAt ? new Date(task.completedAt).toLocaleDateString('en-NZ') : ''}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Rollover Button */}
                  {canEdit && (
                    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/30">
                      {showRolloverConfirm === cycle.id ? (
                        <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-3 border border-amber-200">
                          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-amber-800">Rollover to next cycle?</p>
                            <p className="text-xs text-amber-600 mt-0.5">All tasks will be reset and a new cycle will begin. Incomplete tasks will carry over unchecked.</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleRollover(cycle.id)} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition">Confirm</button>
                            <button onClick={() => setShowRolloverConfirm(null)} className="px-3 py-1.5 border border-amber-300 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setShowRolloverConfirm(cycle.id)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-sm font-medium transition border border-indigo-200">
                          <RotateCcw className="w-4 h-4" /> Rollover to Next Cycle
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredCycles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <CalendarCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No cycles match the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
