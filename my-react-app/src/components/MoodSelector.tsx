
import React from 'react';
import type { Mood } from '../types';
import { Mood as MoodEnum } from '../types';
import { MOOD_CONFIG } from '../constants';

interface MoodSelectorProps {
  onSelect: (mood: Mood) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="max-w-2xl w-full px-6 text-center">
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl font-black text-slate-800 tracking-tight">Chào bạn!</h1>
          <p className="text-xl text-slate-500 font-medium">Hôm nay bạn cảm thấy thế nào?</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(Object.keys(MoodEnum) as Mood[]).map((mood) => {
            const config = MOOD_CONFIG[mood];
            return (
              <button
                key={mood}
                onClick={() => onSelect(mood)}
                className="group flex flex-col items-center p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 ${config.bg} ${config.color}`}>
                  <i className={`fas ${config.icon} text-3xl`}></i>
                </div>
                <span className="font-black text-slate-800 tracking-tight">{config.label}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-12 text-slate-400 text-sm font-medium">
          Chúng tôi sẽ lọc các nhiệm vụ phù hợp nhất với tâm trạng của bạn.
        </p>
      </div>
    </div>
  );
};

export default MoodSelector;
