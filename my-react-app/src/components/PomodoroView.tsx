
import React, { useState, useEffect, useMemo } from 'react';
import type { Task, SubTask } from '../types';

interface PomodoroViewProps {
  task: Task;
  onBack: () => void;
  onUpdateSubTasks: (taskId: string, subTasks: SubTask[]) => void;
  isDarkMode?: boolean;
}

const PomodoroView: React.FC<PomodoroViewProps> = ({ task, onBack, onUpdateSubTasks, isDarkMode }) => {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [totalTime, setTotalTime] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [localSubTasks, setLocalSubTasks] = useState<SubTask[]>(task.subTasks || []);

  const size = 300; 
  const strokeWidth = 10;
  const center = size / 2;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      alert(isBreak ? "Hoàn thành giải lao!" : "Hoàn thành tập trung!");
      handleToggleMode();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const handleToggleMode = () => {
    const nextIsBreak = !isBreak;
    setIsBreak(nextIsBreak);
    const nextTime = nextIsBreak ? BREAK_TIME : WORK_TIME;
    setTimeLeft(nextTime);
    setTotalTime(nextTime);
    setIsActive(false);
    setHasStarted(false);
  };

  const toggleTimer = () => {
    if (!hasStarted) setHasStarted(true);
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setHasStarted(false);
    const time = isBreak ? BREAK_TIME : WORK_TIME;
    setTimeLeft(time);
    setTotalTime(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSubTask = (id: string) => {
    const updated = localSubTasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st);
    setLocalSubTasks(updated);
    onUpdateSubTasks(task.id, updated);
  };

  const progressOffset = useMemo(() => {
    const progress = timeLeft / totalTime;
    return circumference * (1 - progress);
  }, [timeLeft, totalTime, circumference]);

  const strokeColor = useMemo(() => {
    if (!hasStarted) return '#e2e8f0';
    return isBreak ? '#10b981' : '#f43f5e';
  }, [hasStarted, isBreak]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto py-4 animate-in slide-in-from-bottom-10 duration-700">
      <div className="flex-[1.5] flex flex-col items-center bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-50 dark:border-slate-800 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-500 ${isBreak ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>

        <button onClick={onBack} className="self-start mb-6 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 font-bold transition-colors">
          <i className="fas fa-arrow-left text-xs"></i>
          <span>Quay lại</span>
        </button>

        <div className="text-center space-y-2 mb-10">
          <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${isBreak ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
            {isBreak ? 'Giải lao' : 'Tập trung'}
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{task.title}</h2>
        </div>

        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx={center} cy={center} r={radius} fill="transparent" stroke={isDarkMode ? '#334155' : '#f1f5f9'} strokeWidth={strokeWidth} />
            <circle 
              cx={center} cy={center} r={radius} 
              fill="transparent" stroke={strokeColor} strokeWidth={strokeWidth}
              strokeDasharray={circumference} strokeDashoffset={hasStarted ? progressOffset : 0}
              strokeLinecap="round" className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="z-10 text-center">
            <div className="text-6xl md:text-7xl font-black text-slate-800 dark:text-slate-100 tabular-nums">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-12">
          <button onClick={resetTimer} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all flex items-center justify-center"><i className="fas fa-redo-alt"></i></button>
          <button onClick={toggleTimer} className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-2xl transition-all shadow-xl transform active:scale-95 ${isActive ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
            <i className={`fas ${isActive ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button onClick={handleToggleMode} className={`w-12 h-12 rounded-full flex items-center justify-center ${isBreak ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'}`}><i className={`fas ${isBreak ? 'fa-briefcase' : 'fa-coffee'}`}></i></button>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col bg-white dark:bg-slate-900/50 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs"><i className="fas fa-check"></i></span>
          Mục tiêu
        </h3>
        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
          {localSubTasks.map(st => (
            <div key={st.id} onClick={() => toggleSubTask(st.id)} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${st.completed ? 'bg-slate-50 dark:bg-slate-800/30 border-transparent opacity-60' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${st.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-200 dark:border-slate-600'}`}>
                {st.completed && <i className="fas fa-check text-[8px] text-white"></i>}
              </div>
              <span className={`text-xs font-bold truncate ${st.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{st.title}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
           <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Tiến độ</p>
           <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(localSubTasks.filter(s => s.completed).length / (localSubTasks.length || 1)) * 100}%` }}></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroView;
