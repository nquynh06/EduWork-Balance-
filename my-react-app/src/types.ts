
export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export const Mood = {
  HAPPY: 'HAPPY',
  CALM: 'CALM',
  STRESSED: 'STRESSED',
  MOTIVATED: 'MOTIVATED',
} as const;

export type Mood = typeof Mood[keyof typeof Mood];

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  mood: Mood;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  subTasks: SubTask[];
  order: number;
  isUrgent: boolean;
  isImportant: boolean;
}

export interface Project {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type ViewType = 'KANBAN' | 'TABLE' | 'CALENDAR' | 'ANALYSIS' | 'GLOBAL_DASHBOARD' | 'POMODORO';

export interface AppData {
  projects: Project[];
  tasks: Task[];
  activeProjectId: string | null;
  activeView: ViewType;
  userMood: Mood | null;
}
