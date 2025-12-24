
import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { type Task, TaskStatus } from '../types';

interface AnalysisViewProps {
  tasks: Task[];
  isDarkMode?: boolean;
  onAddTask?: (eisenhower: {isUrgent: boolean, isImportant: boolean}) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ tasks, isDarkMode, onAddTask }) => {
  const chartTextColor = isDarkMode ? '#94a3b8' : '#64748b';

  const quadrants = useMemo(() => [
    {
      id: 'q1',
      title: 'LÀM NGAY',
      subtitle: 'Khẩn cấp & Quan trọng',
      tasks: tasks.filter(t => t.isUrgent && t.isImportant && t.status !== TaskStatus.DONE),
      bgColor: 'bg-rose-50/50 dark:bg-rose-950/30',
      borderColor: 'border-rose-100 dark:border-rose-900/50',
      accentColor: 'text-rose-600 dark:text-rose-400',
      isImportant: true,
      isUrgent: true,
      icon: 'fa-fire-alt'
    },
    {
      id: 'q2',
      title: 'LÊN LỊCH',
      subtitle: 'Quan trọng, Chưa gấp',
      tasks: tasks.filter(t => !t.isUrgent && t.isImportant && t.status !== TaskStatus.DONE),
      bgColor: 'bg-amber-50/50 dark:bg-amber-950/30',
      borderColor: 'border-amber-100 dark:border-amber-900/50',
      accentColor: 'text-amber-600 dark:text-amber-400',
      isImportant: true,
      isUrgent: false,
      icon: 'fa-calendar-alt'
    },
    {
      id: 'q3',
      title: 'ỦY QUYỀN',
      subtitle: 'Gấp, Ít quan trọng',
      tasks: tasks.filter(t => t.isUrgent && !t.isImportant && t.status !== TaskStatus.DONE),
      bgColor: 'bg-indigo-50/50 dark:bg-indigo-950/30',
      borderColor: 'border-indigo-100 dark:border-indigo-900/50',
      accentColor: 'text-indigo-600 dark:text-indigo-400',
      isImportant: false,
      isUrgent: true,
      icon: 'fa-people-arrows'
    },
    {
      id: 'q4',
      title: 'LOẠI BỎ',
      subtitle: 'Không gấp & Ít quan trọng',
      tasks: tasks.filter(t => !t.isUrgent && !t.isImportant && t.status !== TaskStatus.DONE),
      bgColor: 'bg-slate-50/50 dark:bg-slate-800/50',
      borderColor: 'border-slate-200 dark:border-slate-700',
      accentColor: 'text-slate-600 dark:text-slate-400',
      isImportant: false,
      isUrgent: false,
      icon: 'fa-trash-alt'
    }
  ], [tasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusData = useMemo(() => {
    const counts = {
      [TaskStatus.TODO]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.DONE]: 0,
    };
    tasks.forEach(t => counts[t.status]++);
    return [
      { name: 'Cần làm', value: counts[TaskStatus.TODO], color: '#94a3b8' },
      { name: 'Đang làm', value: counts[TaskStatus.IN_PROGRESS], color: '#3b82f6' },
      { name: 'Hoàn thành', value: counts[TaskStatus.DONE], color: '#10b981' },
    ].filter(item => item.value > 0);
  }, [tasks]);

  const comparisonData = useMemo(() => {
    const dates = Array.from(new Set(tasks.map(t => t.dueDate))).sort();
    const displayDates = dates.slice(-5);
    return displayDates.map(date => {
      const dayTasks = tasks.filter(t => t.dueDate === date);
      const completed = dayTasks.filter(t => t.status === TaskStatus.DONE).length;
      return {
        date: date.split('-').slice(1).join('/'),
        'Kế hoạch': dayTasks.length,
        'Thực tế': completed
      };
    });
  }, [tasks]);

  return (
    <div className="space-y-6 md:space-y-8 pb-20 px-1 md:px-0">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Tiến độ dự án</p>
          <div className="flex items-end gap-3">
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">{completionRate}%</h2>
            <div className="mb-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {completedTasks}/{totalTasks}
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
            <i className="fas fa-bolt text-xl"></i>
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Cân bằng</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Hiệu suất ổn định</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <i className="fas fa-chart-line text-xl"></i>
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Xu hướng</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Đang tăng trưởng</p>
          </div>
        </div>
      </div>

      {/* Eisenhower Matrix Section */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Ma trận Eisenhower</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Phân tích mức độ ưu tiên</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {quadrants.map((q) => (
            <div 
              key={q.id} 
              className={`p-4 md:p-6 ${q.bgColor} border-2 ${q.borderColor} rounded-2xl flex flex-col min-h-[200px] md:min-h-[250px] transition-all hover:shadow-lg`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 ${q.accentColor} shadow-sm border border-slate-100 dark:border-slate-800`}>
                  <i className={`fas ${q.icon} text-sm`}></i>
                </div>
                <div className="min-w-0">
                  <h4 className={`text-[10px] md:text-xs font-black tracking-widest uppercase ${q.accentColor}`}>
                    {q.title}
                  </h4>
                  <p className="text-[8px] md:text-[9px] text-slate-400 font-bold truncate">{q.subtitle}</p>
                </div>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                {q.tasks.length > 0 ? (
                  q.tasks.map(task => (
                    <div key={task.id} className="flex items-start gap-2 text-[10px] md:text-xs text-slate-700 dark:text-slate-300 group">
                       <i className={`fas fa-circle mt-1 ${q.accentColor} text-[4px] shrink-0`}></i>
                       <span className="flex-1 leading-tight font-medium line-clamp-2">
                         {task.title}
                       </span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center opacity-10">
                    <i className="fas fa-check-circle text-4xl"></i>
                  </div>
                )}
              </div>

              <button 
                onClick={() => onAddTask?.({ isUrgent: q.isUrgent, isImportant: q.isImportant })}
                className={`mt-4 w-full py-2 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-white/60 dark:bg-slate-900/40 ${q.accentColor} border ${q.borderColor} hover:bg-white dark:hover:bg-slate-900 transition-colors`}
              >
                + Thêm mới
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6">Trạng thái</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={statusData} 
                  innerRadius={60} 
                  outerRadius={90} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', background: isDarkMode ? '#1e293b' : '#fff' }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6">Tiến độ gần đây</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: chartTextColor }} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', background: isDarkMode ? '#1e293b' : '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                <Bar dataKey="Kế hoạch" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Thực tế" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
