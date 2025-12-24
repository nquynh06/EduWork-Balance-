
import { Mood as MoodEnum } from './types';

export const STATUS_LABELS = {
  TODO: 'Cần làm',
  IN_PROGRESS: 'Đang làm',
  DONE: 'Hoàn thành'
};

export const PRIORITY_LABELS = {
  LOW: 'Thấp',
  MEDIUM: 'Trung bình',
  HIGH: 'Cao'
};

export const MOOD_CONFIG = {
  [MoodEnum.HAPPY]: {
    label: 'Hứng khởi',
    icon: 'fa-smile-beam',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/40',
    gradient: 'from-amber-400 to-orange-500',
    description: 'Tuyệt vời! Hãy làm những việc sáng tạo nhé.'
  },
  [MoodEnum.CALM]: {
    label: 'Bình tĩnh',
    icon: 'fa-leaf',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/40',
    gradient: 'from-emerald-400 to-teal-500',
    description: 'Không gian yên tĩnh cho những việc cần sự tập trung cao.'
  },
  [MoodEnum.STRESSED]: {
    label: 'Căng thẳng',
    icon: 'fa-bolt',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'border-rose-200 dark:border-rose-500/40',
    gradient: 'from-rose-400 to-pink-500',
    description: 'Hít thở sâu. Hãy bắt đầu với những việc nhỏ, dễ dàng.'
  },
  [MoodEnum.MOTIVATED]: {
    label: 'Quyết tâm',
    icon: 'fa-fire',
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    border: 'border-orange-200 dark:border-orange-500/40',
    gradient: 'from-orange-500 to-red-600',
    description: 'Năng lượng tràn trề! Sẵn sàng cho những thử thách lớn.'
  }
};

export const PRIORITY_COLORS = {
  LOW: 'bg-blue-100 text-blue-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-rose-100 text-rose-700'
};

export const STATUS_UI_CONFIG = {
  TODO: {
    bg: 'bg-slate-100',
    dot: 'bg-slate-400',
    text: 'text-slate-600',
    pillBg: 'bg-slate-200/50'
  },
  IN_PROGRESS: {
    bg: 'bg-blue-50',
    dot: 'bg-blue-500',
    text: 'text-blue-600',
    pillBg: 'bg-blue-100/50'
  },
  DONE: {
    bg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600',
    pillBg: 'bg-emerald-100/50'
  }
};

export const DEFAULT_PROJECTS = [
  { id: 'study', name: 'Học tập', icon: 'fa-book', color: '#4f46e5' },
  { id: 'work', name: 'Công việc', icon: 'fa-briefcase', color: '#0891b2' },
  { id: 'personal', name: 'Cá nhân', icon: 'fa-user', color: '#db2777' }
];
