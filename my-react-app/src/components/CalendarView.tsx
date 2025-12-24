
import React, { useState } from 'react';
import type { Task } from '../types';
import { PRIORITY_COLORS } from '../constants';

interface CalendarViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onEditTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [] = useState<string | null>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startOffset = startDayOfMonth(year, month);

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getTasksForDay = (day: number) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const days = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800"></div>);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayTasks = getTasksForDay(day);
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    
    days.push(
      <div 
        key={day}
        className={`h-24 md:h-32 border border-slate-100 dark:border-slate-800 p-2 transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 group flex flex-col ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : 'bg-white dark:bg-slate-900'}`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className={`text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-400 dark:text-slate-600'}`}>
            {day}
          </span>
          {dayTasks.length > 0 && <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-1 rounded-md">{dayTasks.length}</span>}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
          {dayTasks.slice(0, 2).map(task => (
            <div key={task.id} onClick={() => onEditTask(task)} className={`text-[8px] font-bold px-1 py-0.5 rounded border border-transparent hover:border-indigo-300 dark:hover:border-indigo-700 truncate ${PRIORITY_COLORS[task.priority]} dark:bg-slate-800 shadow-xs`}>
              {task.title}
            </div>
          ))}
          {dayTasks.length > 2 && <div className="text-[8px] text-slate-400 font-bold">+ {dayTasks.length - 2}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{monthNames[month]}, {year}</h3>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
           <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500"><i className="fas fa-chevron-left text-xs"></i></button>
           <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500"><i className="fas fa-chevron-right text-xs"></i></button>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
            <div key={d} className="py-3 text-center text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">{days}</div>
      </div>
    </div>
  );
};

export default CalendarView;
