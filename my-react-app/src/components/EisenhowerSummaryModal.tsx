
import React from 'react';
import type { Task } from '../types';

interface EisenhowerSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

const EisenhowerSummaryModal: React.FC<EisenhowerSummaryModalProps> = ({ isOpen, onClose, tasks }) => {
  if (!isOpen) return null;

  const quadrants = [
    {
      title: 'Làm ngay',
      tasks: tasks.filter(t => t.isUrgent && t.isImportant),
      color: 'rose',
      icon: 'fa-fire'
    },
    {
      title: 'Lên kế hoạch',
      tasks: tasks.filter(t => !t.isUrgent && t.isImportant),
      color: 'indigo',
      icon: 'fa-calendar-check'
    },
    {
      title: 'Ủy quyền',
      tasks: tasks.filter(t => t.isUrgent && !t.isImportant),
      color: 'amber',
      icon: 'fa-user-friends'
    },
    {
      title: 'Loại bỏ',
      tasks: tasks.filter(t => !t.isUrgent && !t.isImportant),
      color: 'slate',
      icon: 'fa-trash-restore'
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[85vh]">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Tóm tắt Ma trận Eisenhower</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Phân tích mức độ ưu tiên nhiệm vụ</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <i className="fas fa-times text-slate-400"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar">
          {quadrants.map((q) => (
            <div key={q.title} className="flex flex-col gap-4">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-xl bg-${q.color}-50/50 dark:bg-${q.color}-500/10 border border-${q.color}-100 dark:border-${q.color}-900/30`}>
                <i className={`fas ${q.icon} text-${q.color}-500`}></i>
                <h4 className={`text-sm font-black text-${q.color}-600 dark:text-${q.color}-400 uppercase tracking-wide`}>
                  {q.title} ({q.tasks.length})
                </h4>
              </div>
              
              <div className="space-y-2">
                {q.tasks.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic font-medium px-4">Không có nhiệm vụ nào trong nhóm này.</p>
                ) : (
                  q.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${q.color}-500`}></div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{task.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-center">
           <p className="text-[10px] text-slate-400 font-bold italic">"Sắp xếp thông minh, làm việc hiệu quả hơn!"</p>
        </div>
      </div>
    </div>
  );
};

export default EisenhowerSummaryModal;
