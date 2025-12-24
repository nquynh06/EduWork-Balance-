
import React from 'react';
import type { Project, ViewType } from '../types';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  activeView: ViewType;
  onSelectProject: (id: string) => void;
  onSelectGlobal: () => void;
  onAddProject: () => void;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  projects, 
  activeProjectId, 
  activeView, 
  onSelectProject, 
  onSelectGlobal, 
  onAddProject,
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <i className="fas fa-balance-scale"></i>
              <span>EduWork Balance</span>
            </h1>
            <button 
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-8 overflow-y-auto custom-scrollbar">
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">Chung</p>
              <button
                onClick={onSelectGlobal}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeView === 'GLOBAL_DASHBOARD' 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <i className="fas fa-chart-pie w-5"></i>
                <span className="font-medium">Tổng quát</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Dự án</p>
                <button 
                  onClick={onAddProject}
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="space-y-1">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activeProjectId === project.id && activeView !== 'GLOBAL_DASHBOARD'
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <i className={`fas ${project.icon} w-5`} style={{ color: project.color }}></i>
                    <span className="font-medium truncate">{project.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <div className="p-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
              © EduWork Balance
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
