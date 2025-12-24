
import React, { useState, useEffect } from 'react';
import type { Task, SubTask } from '../types';
import { TaskStatus, TaskPriority, Mood } from '../types';
import { PRIORITY_LABELS } from '../constants';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  onStartPomodoro?: (task: Task) => void;
  initialData?: Task | null;
  defaultStatus?: TaskStatus;
  defaultEisenhower?: {isUrgent: boolean, isImportant: boolean} | null;
  projectId: string;
  userMood: Mood | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onStartPomodoro,
  initialData, 
  defaultStatus = TaskStatus.TODO,
  defaultEisenhower = null,
  projectId,
  userMood
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: defaultStatus,
    priority: TaskPriority.MEDIUM,
    mood: userMood || Mood.HAPPY,
    dueDate: new Date().toISOString().split('T')[0],
    subTasks: [],
    isUrgent: defaultEisenhower?.isUrgent ?? false,
    isImportant: defaultEisenhower?.isImportant ?? true
  });

  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        title: '',
        description: '',
        status: defaultStatus,
        priority: TaskPriority.MEDIUM,
        mood: userMood || Mood.HAPPY,
        dueDate: new Date().toISOString().split('T')[0],
        subTasks: [],
        isUrgent: defaultEisenhower?.isUrgent ?? false,
        isImportant: defaultEisenhower?.isImportant ?? true
      });
    }
  }, [initialData, isOpen, defaultStatus, userMood, defaultEisenhower]);

  const addSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTaskTitle.trim()) return;
    const newSub: SubTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newSubTaskTitle,
      completed: false
    };
    setFormData(prev => ({
      ...prev,
      subTasks: [...(prev.subTasks || []), newSub]
    }));
    setNewSubTaskTitle('');
  };

  const toggleSubTask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subTasks: prev.subTasks?.map(st => st.id === id ? { ...st, completed: !st.completed } : st)
    }));
  };

  const removeSubTask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subTasks: prev.subTasks?.filter(st => st.id !== id)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
            {initialData ? 'Sửa nhiệm vụ' : 'Nhiệm vụ mới'}
          </h3>
          {initialData && (
            <button 
              onClick={() => onStartPomodoro?.(initialData as Task)}
              className="px-3 py-1 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase hover:bg-rose-600 transition-colors"
            >
              <i className="fas fa-stopwatch mr-1"></i> Pomodoro
            </button>
          )}
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Tiêu đề</label>
            <input
              required autoFocus
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100"
              placeholder="Cần làm gì?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setFormData(prev => ({ ...prev, isImportant: !prev.isImportant }))}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.isImportant ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-700 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-400'}`}
            >
              <i className={`fas fa-star ${formData.isImportant ? 'text-indigo-500' : ''}`}></i>
              <span className="text-[10px] font-black uppercase">Quan trọng</span>
            </div>
            <div 
              onClick={() => setFormData(prev => ({ ...prev, isUrgent: !prev.isUrgent }))}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.isUrgent ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-700 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-400'}`}
            >
              <i className={`fas fa-bolt ${formData.isUrgent ? 'text-rose-500' : ''}`}></i>
              <span className="text-[10px] font-black uppercase">Khẩn cấp</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Ưu tiên</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-slate-100 font-bold"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              >
                {Object.values(TaskPriority).map(p => (
                  <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Hạn chót</label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-slate-100 font-bold"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Nhiệm vụ nhỏ ({formData.subTasks?.length || 0})</label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100 text-sm"
                  placeholder="Thêm nhiệm vụ phụ..."
                  value={newSubTaskTitle}
                  onChange={(e) => setNewSubTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSubTask(e as any)}
                />
                <button 
                  type="button"
                  onClick={addSubTask}
                  className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>

              <div className="space-y-2">
                {formData.subTasks?.map((st) => (
                  <div key={st.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl group">
                    <button 
                      type="button"
                      onClick={() => toggleSubTask(st.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${st.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}
                    >
                      {st.completed && <i className="fas fa-check text-[10px] text-white"></i>}
                    </button>
                    <span className={`text-sm flex-1 ${st.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {st.title}
                    </span>
                    <button 
                      type="button"
                      onClick={() => removeSubTask(st.id)}
                      className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 shrink-0 border-t border-slate-100 dark:border-slate-800 flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold">Hủy</button>
          <button 
            type="button" 
            onClick={() => onSave({ ...formData, projectId })} 
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
