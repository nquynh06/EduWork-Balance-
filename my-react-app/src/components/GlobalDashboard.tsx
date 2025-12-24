
import React from 'react';
import type { Project, Task } from '../types';
import { TaskStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STATUS_LABELS } from '../constants';

interface GlobalDashboardProps {
  projects: Project[];
  tasks: Task[];
}

const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ projects, tasks }) => {
  const projectStats = projects.map(project => {
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    const completed = projectTasks.filter(t => t.status === TaskStatus.DONE).length;
    return {
      name: project.name,
      total: projectTasks.length,
      completed,
      color: project.color,
      progress: projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0
    };
  });

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const totalCompleted = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const totalIncomplete = tasks.length - totalCompleted;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-indigo-600 dark:bg-indigo-700 text-white p-6 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-white/20 rounded-lg"><i className="fas fa-layer-group"></i></span>
            <span className="text-xs font-bold uppercase opacity-60">Không gian</span>
          </div>
          <p className="text-4xl font-bold">{projects.length}</p>
          <p className="mt-2 text-sm opacity-80">Phân loại học tập & việc</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><i className="fas fa-check-double"></i></span>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Hoàn thành</span>
          </div>
          <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">{totalCompleted}</p>
          <p className="mt-2 text-sm text-emerald-600">Đã xong</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg"><i className="fas fa-clock"></i></span>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Chưa xong</span>
          </div>
          <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">{totalIncomplete}</p>
          <p className="mt-2 text-sm text-amber-600">Cần tập trung</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg"><i className="fas fa-tasks"></i></span>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Hiệu quả</span>
          </div>
          <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">
            {tasks.length ? Math.round((totalCompleted / tasks.length) * 100) : 0}%
          </p>
          <p className="mt-2 text-sm text-purple-600">Tổng quan chung</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Tải công việc theo dự án</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStats} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff' }} />
                <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={12}>
                  {projectStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            {projectStats.map(ps => (
              <div key={ps.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ps.name}</span>
                  <span className="text-slate-400">{ps.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000"
                    style={{ width: `${ps.progress}%`, backgroundColor: ps.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Mới cập nhật</h3>
          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <i className="fas fa-ghost text-4xl mb-4 opacity-20"></i>
                <p>Chưa có dữ liệu.</p>
              </div>
            ) : (
              recentTasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <div key={task.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: project?.color || '#cbd5e1' }}
                    >
                      <i className={`fas ${project?.icon || 'fa-tag'}`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{task.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{project?.name} • {task.createdAt}</p>
                    </div>
                    <div className="text-right">
                       <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                         task.status === TaskStatus.DONE ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                       }`}>
                         {STATUS_LABELS[task.status as TaskStatus]}
                       </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <i className="fas fa-lightbulb text-indigo-500 text-xl"></i>
               <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium leading-tight">Mẹo: Cân bằng thời gian học tập và làm việc để tinh thần luôn hưng phấn!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
