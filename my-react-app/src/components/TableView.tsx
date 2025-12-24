
import React from 'react';
import { type Task, TaskStatus, Mood } from '../types';
import { STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, MOOD_CONFIG } from '../constants';

interface TableViewProps {
  tasks: Task[];
  currentUserMood: Mood | null;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TableView: React.FC<TableViewProps> = ({ tasks, currentUserMood, onUpdateStatus, onEditTask, onDeleteTask }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nhiệm vụ</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tâm trạng</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Trạng thái</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ưu tiên</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Hạn chót</th>
              <th className="px-6 py-5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-slate-400 dark:text-slate-600">
                   <p className="font-bold text-sm">Trống...</p>
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const isMatchGlobalMood = currentUserMood === task.mood;
                const moodInfo = MOOD_CONFIG[task.mood];

                return (
                  <tr 
                    key={task.id} 
                    className={`transition-colors group ${isMatchGlobalMood ? moodInfo.bg + ' dark:bg-opacity-10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <td className="px-6 py-4">
                      <span className={`font-bold text-sm ${isMatchGlobalMood ? 'text-slate-900 dark:text-slate-100' : 'text-slate-800 dark:text-slate-200'}`}>
                        {task.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className={`flex items-center gap-2 px-2 py-1 rounded-full w-fit ${isMatchGlobalMood ? 'bg-white/50 dark:bg-black/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                          <i className={`fas ${moodInfo.icon} ${moodInfo.color} text-[10px]`}></i>
                          <span className="text-[9px] font-bold uppercase text-slate-500">{moodInfo.label}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className="text-[10px] font-bold bg-white/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1.5 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                        value={task.status}
                        onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                      >
                        {Object.values(TaskStatus).map(s => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] uppercase font-black px-2 py-1 rounded-md ${PRIORITY_COLORS[task.priority]} dark:bg-slate-800`}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{task.dueDate}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEditTask(task)} className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600"><i className="fas fa-edit text-xs"></i></button>
                        <button onClick={() => onDeleteTask(task.id)} className="p-2 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500"><i className="fas fa-trash text-xs"></i></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
