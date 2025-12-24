
import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import type { Task, Project, ViewType, AppData, SubTask } from './types';
import { TaskStatus, TaskPriority, Mood } from './types';
import { DEFAULT_PROJECTS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KanbanView from './components/KanbanView';
import TableView from './components/TableView';
import AnalysisView from './components/AnalysisView';
import CalendarView from './components/CalendarView';
import GlobalDashboard from './components/GlobalDashboard';
import TaskModal from './components/TaskModal';
import PomodoroView from './components/PomodoroView';
import MoodSelector from './components/MoodSelector';
import EisenhowerSummaryModal from './components/EisenhowerSummaryModal';

const STORAGE_KEY = 'eduwork_balance_data_v1';
const THEME_KEY = 'eduwork_theme';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.activeProjectId && parsed.projects.length > 0) {
        parsed.activeProjectId = parsed.projects[0].id;
      }
      return parsed;
    }
    return {
      projects: DEFAULT_PROJECTS,
      tasks: [],
      activeProjectId: DEFAULT_PROJECTS[0].id,
      activeView: 'KANBAN',
      userMood: null
    };
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return false; // Default to light mode
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEisenhowerSummaryOpen, setIsEisenhowerSummaryOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activePomodoroTask, setActivePomodoroTask] = useState<Task | null>(null);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [modalDefaultEisenhower, setModalDefaultEisenhower] = useState<{isUrgent: boolean, isImportant: boolean} | null>(null);
  
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'ALL'>('ALL');
  const [filterMood, setFilterMood] = useState<Mood | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSelectProject = (id: string) => {
    setData(prev => ({ 
      ...prev, 
      activeProjectId: id, 
      activeView: prev.activeView === 'GLOBAL_DASHBOARD' || prev.activeView === 'POMODORO' ? 'KANBAN' : prev.activeView 
    }));
    setIsSidebarOpen(false);
  };

  const handleSelectGlobal = () => {
    setData(prev => ({ ...prev, activeView: 'GLOBAL_DASHBOARD' }));
    setIsSidebarOpen(false);
  };

  const handleViewChange = (view: ViewType) => {
    setData(prev => ({ ...prev, activeView: view }));
  };

  const handleAddTask = (status: TaskStatus = TaskStatus.TODO, eisenhower?: {isUrgent: boolean, isImportant: boolean}) => {
    setEditingTask(null);
    setModalDefaultStatus(status);
    setModalDefaultEisenhower(eisenhower || null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalDefaultEisenhower(null);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === editingTask.id ? { 
          ...t, 
          ...taskData,
          completedAt: taskData.status === TaskStatus.DONE && t.status !== TaskStatus.DONE 
            ? new Date().toISOString().split('T')[0] 
            : t.completedAt
        } as Task : t)
      }));
    } else {
      const isDone = taskData.status === TaskStatus.DONE;
      const newTask: Task = {
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        mood: data.userMood || Mood.HAPPY,
        dueDate: new Date().toISOString().split('T')[0],
        subTasks: [],
        isUrgent: false,
        isImportant: true,
        ...taskData,
        id: Math.random().toString(36).substr(2, 9),
        projectId: data.activeProjectId!,
        createdAt: new Date().toISOString().split('T')[0],
        completedAt: isDone ? new Date().toISOString().split('T')[0] : undefined,
        order: data.tasks.length
      } as Task;
      setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    }
    setIsTaskModalOpen(false);
  };

  const handleUpdateSubTasks = (taskId: string, subTasks: SubTask[]) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, subTasks } : t)
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Xóa nhiệm vụ này?')) {
      setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) }));
    }
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === taskId) {
          return { 
            ...t, 
            status: newStatus,
            completedAt: newStatus === TaskStatus.DONE ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return t;
      })
    }));
  };

  const handleMoveTask = (taskId: string, newStatus: TaskStatus, targetTaskId?: string) => {
    setData(prev => {
      const tasks = [...prev.tasks];
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;

      const [task] = tasks.splice(taskIndex, 1);
      
      const updatedTask = { 
        ...task, 
        status: newStatus,
        completedAt: newStatus === TaskStatus.DONE ? new Date().toISOString().split('T')[0] : undefined
      };

      if (targetTaskId) {
        const targetIndex = tasks.findIndex(t => t.id === targetTaskId);
        tasks.splice(targetIndex, 0, updatedTask);
      } else {
        tasks.push(updatedTask);
      }

      const reorderedTasks = tasks.map((t, idx) => ({ ...t, order: idx }));
      return { ...prev, tasks: reorderedTasks };
    });
  };

  const handleStartPomodoro = (task: Task) => {
    setActivePomodoroTask(task);
    setData(prev => ({ ...prev, activeView: 'POMODORO' }));
    setIsTaskModalOpen(false);
  };

  const handleAddProject = () => {
    const name = window.prompt('Nhập tên không gian mới:');
    if (name) {
      const newProject: Project = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        icon: 'fa-rocket',
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      setData(prev => ({ ...prev, projects: [...prev.projects, newProject], activeProjectId: newProject.id }));
    }
  };

  const handleMoodSelect = (mood: Mood) => {
    setData(prev => ({ ...prev, userMood: mood }));
    setFilterMood(mood);
  };

  const activeProject = data.projects.find(p => p.id === data.activeProjectId) || null;

  const filteredTasks = useMemo(() => {
    let result = data.tasks.filter(t => t.projectId === data.activeProjectId);
    result.sort((a, b) => a.order - b.order);

    if (filterPriority !== 'ALL') {
      result = result.filter(t => t.priority === filterPriority);
    }
    if (filterMood !== 'ALL') {
      result = result.filter(t => t.mood === filterMood);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [data.tasks, data.activeProjectId, filterPriority, filterMood, searchQuery]);

  const renderContent = () => {
    if (data.activeView === 'GLOBAL_DASHBOARD') {
      return <GlobalDashboard projects={data.projects} tasks={data.tasks} />;
    }

    if (data.activeView === 'POMODORO' && activePomodoroTask) {
      return (
        <PomodoroView 
          task={activePomodoroTask} 
          onBack={() => setData(prev => ({ ...prev, activeView: 'KANBAN' }))}
          onUpdateSubTasks={handleUpdateSubTasks}
          isDarkMode={isDarkMode}
        />
      );
    }

    switch (data.activeView) {
      case 'KANBAN':
        return (
          <KanbanView 
            tasks={filteredTasks} 
            onUpdateStatus={handleMoveTask} 
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onAddTask={handleAddTask}
          />
        );
      case 'TABLE':
        return (
          <TableView 
            tasks={filteredTasks} 
            onUpdateStatus={handleUpdateStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'CALENDAR':
        return (
          <CalendarView 
            tasks={filteredTasks} 
            onEditTask={handleEditTask}
          />
        );
      case 'ANALYSIS':
        return (
          <AnalysisView 
            tasks={filteredTasks} 
            isDarkMode={isDarkMode} 
            onAddTask={(e) => handleAddTask(TaskStatus.TODO, e)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {!data.userMood && <MoodSelector onSelect={handleMoodSelect} />}

      <Sidebar 
        projects={data.projects} 
        activeProjectId={data.activeProjectId}
        activeView={data.activeView}
        onSelectProject={handleSelectProject}
        onSelectGlobal={handleSelectGlobal}
        onAddProject={handleAddProject}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          activeProject={activeProject} 
          activeView={data.activeView}
          onViewChange={handleViewChange}
          onAddTask={() => handleAddTask(TaskStatus.TODO)}
          onMenuToggle={() => setIsSidebarOpen(true)}
          filterPriority={filterPriority}
          onFilterPriorityChange={setFilterPriority}
          filterMood={filterMood}
          onFilterMoodChange={setFilterMood}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          userMood={data.userMood}
          onChangeMood={() => setData(prev => ({ ...prev, userMood: null }))}
          onOpenEisenhowerSummary={() => setIsEisenhowerSummaryOpen(true)}
          allTasks={data.tasks}
          onEditTask={handleEditTask}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onStartPomodoro={handleStartPomodoro}
        initialData={editingTask}
        defaultStatus={modalDefaultStatus}
        defaultEisenhower={modalDefaultEisenhower}
        projectId={data.activeProjectId || ''}
        userMood={data.userMood}
      />

      <EisenhowerSummaryModal 
        isOpen={isEisenhowerSummaryOpen}
        onClose={() => setIsEisenhowerSummaryOpen(false)}
        tasks={filteredTasks}
      />
    </div>
  );
};

export default App;
