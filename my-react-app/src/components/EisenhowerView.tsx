
import React from 'react';
import { type Task } from '../types';
import { MOOD_CONFIG, PRIORITY_COLORS } from '../constants';

type MoodKey = keyof typeof MOOD_CONFIG;

interface EisenhowerViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onUpdateEisenhower: (taskId: string, isUrgent: boolean, isImportant: boolean) => void;
}

const EisenhowerView: React.FC<EisenhowerViewProps> = ({ tasks, onEditTask, onUpdateEisenhower }) => {
  const quadrants = [
    {
      id: 'q1',
      title: 'Làm ngay',
      subtitle: 'Khẩn cấp & Quan trọng',
      color: 'rose',
      icon: 'fa-fire',
      isImportant: true,
      isUrgent: true,
    },
    {
      id: 'q2',
      title: 'Lên kế hoạch',
      subtitle: 'Quan trọng, Không khẩn cấp',
      color: 'indigo',
      icon: 'fa-calendar-check',
      isImportant: true,
      isUrgent: false,
    },
    {
      id: 'q3',
      title: 'Ủy quyền',
      subtitle: 'Khẩn cấp, Không quan trọng',
      color: 'amber',
      icon: 'fa-user-friends',
      isImportant: false,
      isUrgent: true,
    },
    {
      id: 'q4',
      title: 'Loại bỏ',
      subtitle: 'Không khẩn cấp & Không quan trọng',
      color: 'slate',
      icon: 'fa-trash-restore',
      isImportant: false,
      isUrgent: false,
    }
  ];

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const onDrop = (e: React.DragEvent, isUrgent: boolean, isImportant: boolean) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onUpdateEisenhower(taskId, isUrgent, isImportant);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full animate-in fade-in duration-700 pb-10">
      {quadrants.map((q) => {
        const quadrantTasks = tasks.filter(t => t.isUrgent === q.isUrgent && t.isImportant === q.isImportant);
        
        return (
          <div 
            key={q.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, q.isUrgent, q.isImportant)}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden min-h-[350px]"
          >
            <div className={`p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-${q.color}-50/30 dark:bg-${q.color}-500/5`}>
              <div>
                <h3 className={`text-lg font-black text-${q.color}-600 dark:text-${q.color}-400`}>{q.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{q.subtitle}</p>
              </div>
              <div className={`w-10 h-10 rounded-2xl bg-${q.color}-100 dark:bg-${q.color}-500/20 text-${q.color}-600 dark:text-${q.color}-400 flex items-center justify-center`}>
                <i className={`fas ${q.icon}`}></i>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
              {quadrantTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 py-10">
                  <i className="fas fa-inbox text-2xl mb-2 opacity-20"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest">Trống</p>
                </div>
              ) : (
                quadrantTasks.map(task => (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id)}
                    onClick={() => onEditTask(task)}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">{task.title}</p>
                      <span className={`shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <i className={`fas ${MOOD_CONFIG[task.mood as unknown as MoodKey].icon} text-[10px] ${MOOD_CONFIG[task.mood as unknown as MoodKey].color}`}></i>
                       <span className="text-[9px] text-slate-400 font-bold">{task.dueDate.split('-').slice(1).join('/')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EisenhowerView;
