
import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { ViewType, Project, TaskPriority, Mood, Task } from '../types';
import { TaskStatus } from '../types';
import { PRIORITY_LABELS, MOOD_CONFIG } from '../constants';

interface HeaderProps {
  activeProject: Project | null;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onAddTask: () => void;
  onMenuToggle: () => void;
  filterPriority: TaskPriority | 'ALL';
  onFilterPriorityChange: (priority: TaskPriority | 'ALL') => void;
  filterMood: Mood | 'ALL';
  onFilterMoodChange: (mood: Mood | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userMood: Mood | null;
  onChangeMood: () => void;
  onOpenEisenhowerSummary: () => void;
  allTasks: Task[];
  onEditTask: (task: Task) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeProject, 
  activeView, 
  onViewChange, 
  onAddTask,
  onMenuToggle,
  filterPriority,
  onFilterPriorityChange,
  filterMood,
  onFilterMoodChange,
  searchQuery,
  onSearchChange,
  userMood,
  onChangeMood,
  onOpenEisenhowerSummary,
  allTasks,
  onEditTask
}) => {
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const notiRef = useRef<HTMLDivElement>(null);

  const isGlobal = activeView === 'GLOBAL_DASHBOARD';
  const showFilters = activeView === 'KANBAN' || activeView === 'TABLE' || activeView === 'CALENDAR';

  // Tính toán thông báo: Quá hạn hoặc sắp tới hạn (2 ngày)
  const notifications = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allTasks.filter(task => {
      if (task.status === TaskStatus.DONE) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays <= 2;
    }).map(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        ...task,
        type: diffDays < 0 ? 'OVERDUE' : 'URGENT',
        daysLeft: diffDays
      };
    }).sort((a, b) => a.daysLeft - b.daysLeft);
  }, [allTasks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setIsNotiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 md:px-8 py-3 md:py-4">
      <div className="flex flex-col gap-3 md:gap-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={onMenuToggle} className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <i className="fas fa-bars text-lg"></i>
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-xl font-bold text-slate-800 dark:text-slate-100 truncate max-w-[120px] md:max-w-none">
                  {isGlobal ? 'Tổng quát' : activeProject?.name}
                </h2>
                {userMood && !isGlobal && (
                  <button onClick={onChangeMood} className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${MOOD_CONFIG[userMood].bg} ${MOOD_CONFIG[userMood].border} shrink-0`}>
                    <i className={`fas ${MOOD_CONFIG[userMood].icon} ${MOOD_CONFIG[userMood].color} text-[8px]`}></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {!isGlobal && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 md:p-1 rounded-lg flex-1 md:flex-none">
                {(['KANBAN', 'TABLE', 'CALENDAR', 'ANALYSIS'] as ViewType[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => onViewChange(v)}
                    className={`flex-1 md:flex-none flex items-center justify-center px-1 md:px-3 py-1 md:py-1.5 text-[10px] md:text-sm font-medium rounded-md transition-all ${
                      activeView === v 
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <i className={`fas ${
                      v === 'KANBAN' ? 'fa-columns' : 
                      v === 'TABLE' ? 'fa-table' : 
                      v === 'CALENDAR' ? 'fa-calendar-alt' : 
                      'fa-chart-line'}`}></i>
                    <span className="hidden md:inline ml-2">
                      {v === 'KANBAN' ? 'Kanban' : v === 'TABLE' ? 'Bảng' : v === 'CALENDAR' ? 'Lịch' : 'Phân tích'}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-1.5 ml-auto md:ml-2">
                <div className="relative z-40" ref={notiRef}>
                  <button
                    onClick={() => setIsNotiOpen(!isNotiOpen)}
                    className={`p-2 md:p-2.5 rounded-lg transition-colors relative ${notifications.length > 0 ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                  >
                    <i className="fas fa-bell text-sm"></i>
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {isNotiOpen && (
                    <div className="absolute right-0 mt-2 w-64 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Thông báo</h4>
                      </div>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-[10px] font-bold text-slate-400 uppercase">Trống</div>
                        ) : (
                          notifications.map(task => (
                            <button
                              key={task.id}
                              onClick={() => { onEditTask(task); setIsNotiOpen(false); }}
                              className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800/50 transition-colors flex gap-2"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${task.type === 'OVERDUE' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{task.title}</p>
                                <p className={`text-[8px] font-black uppercase mt-0.5 ${task.type === 'OVERDUE' ? 'text-rose-500' : 'text-amber-500'}`}>
                                  {task.type === 'OVERDUE' ? 'Quá hạn' : task.daysLeft === 0 ? 'Hôm nay' : `Còn ${task.daysLeft} ngày`}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={onOpenEisenhowerSummary} className="p-2 md:p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200">
                  <i className="fas fa-list-check text-sm"></i>
                </button>
                <button onClick={onAddTask} className="bg-indigo-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
            <div className="relative w-full">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
              <input 
                type="text"
                placeholder="Tìm nhiệm vụ..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tight shrink-0">Ưu tiên:</span>
                <select 
                  value={filterPriority}
                  onChange={(e) => onFilterPriorityChange(e.target.value as any)}
                  className="flex-1 min-w-0 bg-transparent text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="ALL">Tất cả</option>
                  {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tight shrink-0">Tâm trạng:</span>
                <select 
                  value={filterMood}
                  onChange={(e) => onFilterMoodChange(e.target.value as any)}
                  className="flex-1 min-w-0 bg-transparent text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="ALL">Tất cả</option>
                  {Object.entries(MOOD_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
