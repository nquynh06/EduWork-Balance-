
import React, { useState } from 'react';
import type { Task } from '../types';
import { TaskStatus, TaskPriority } from '../types';
import { STATUS_LABELS, STATUS_UI_CONFIG, MOOD_CONFIG } from '../constants';

interface KanbanViewProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, newStatus: TaskStatus, targetTaskId?: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

const KanbanView: React.FC<KanbanViewProps> = ({ tasks, onUpdateStatus, onEditTask, onAddTask }) => {
  const columns: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
  const [, setDraggedTaskId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<TaskStatus | null>(null);

  const getProgress = (task: Task) => {
    if (!task.subTasks || task.subTasks.length === 0) return 0;
    const completed = task.subTasks.filter(st => st.completed).length;
    return Math.round((completed / task.subTasks.length) * 100);
  };

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => { target.style.opacity = '0.4'; }, 0);
  };

  const onDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
    setDraggedTaskId(null);
    setActiveColumn(null);
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex flex-row gap-1.5 md:gap-6 min-h-[calc(100vh-14rem)] pb-4 overflow-hidden">
        {columns.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          const config = STATUS_UI_CONFIG[status];
          const isColumnActive = activeColumn === status;
          
          return (
            <div 
              key={status} 
              className={`flex-1 flex flex-col w-1/3 min-w-[100px] md:min-w-[250px] rounded-xl transition-colors duration-200 ${isColumnActive ? 'bg-slate-100/50 dark:bg-slate-800/30' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setActiveColumn(status); }}
              onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData('taskId');
                if (taskId) onUpdateStatus(taskId, status);
                setActiveColumn(null);
              }}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-2 md:mb-6 p-1 md:p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                <div className={`flex items-center gap-1 md:gap-2 px-1 py-0.5 rounded-full ${config.pillBg} dark:bg-slate-700/50 overflow-hidden`}>
                  <div className={`w-1 h-1 md:w-2 md:h-2 rounded-full ${config.dot} shrink-0`}></div>
                  <span className="text-[8px] md:text-xs font-black dark:text-slate-300 uppercase tracking-tighter truncate">
                    {STATUS_LABELS[status]}
                  </span>
                </div>
                <span className="text-slate-400 text-[8px] md:text-xs font-bold">{columnTasks.length}</span>
              </div>

              <div className="flex flex-col gap-1.5 md:gap-4 flex-1 overflow-y-auto custom-scrollbar pr-0.5">
                <button
                  onClick={() => onAddTask(status)}
                  className="w-full py-1.5 md:py-3 border border-dashed border-slate-300 dark:border-slate-700 bg-transparent text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-1 text-[8px] md:text-xs font-black uppercase"
                >
                  <i className="fas fa-plus"></i>
                </button>

                {columnTasks.map((task) => {
                  const progress = getProgress(task);
                  const moodInfo = MOOD_CONFIG[task.mood];

                  return (
                    <div 
                      key={task.id}
                      draggable="true"
                      onDragStart={(e) => onDragStart(e, task.id)}
                      onDragEnd={onDragEnd}
                      onClick={() => onEditTask(task)}
                      className={`group bg-white dark:bg-slate-900 p-1.5 md:p-4 rounded-lg md:rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing relative ${task.priority === TaskPriority.HIGH ? 'border-l-2 border-l-rose-500' : task.priority === TaskPriority.MEDIUM ? 'border-l-2 border-l-amber-500' : 'border-l-2 border-l-blue-500'}`}
                    >
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[9px] md:text-sm leading-tight mb-1 md:mb-3 line-clamp-2">
                        {task.title}
                      </h4>
                      
                      <div className="flex items-center gap-1 mb-1 md:mb-3">
                        <span className={`text-[7px] md:text-[8px] font-black uppercase px-1 py-0.5 rounded ${moodInfo.bg} dark:bg-slate-800 ${moodInfo.color} truncate`}>
                          <i className={`fas ${moodInfo.icon}`}></i>
                        </span>
                      </div>
                      
                      {task.subTasks.length > 0 && (
                        <div className="mb-1 md:mb-3">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-0.5 md:h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full transition-all" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-50 dark:border-slate-800/50">
                        <span className="text-slate-400 text-[7px] md:text-[9px] font-bold">
                          {task.dueDate.split('-').slice(1).join('/')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanView;
