import React from 'react';
import { Play, Pause, RotateCcw, Minus, Plus } from 'lucide-react';
import { usePomodoro } from '../hooks/usePomodoro';

const Pomodoro: React.FC = () => {
  const {
    timeLeft,
    totalTime,
    isActive,
    timerState,
    workDuration,
    breakDuration,
    start,
    pause,
    reset,
    setWorkDuration,
    setBreakDuration,
  } = usePomodoro();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl w-80 text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 tracking-widest">
        {timerState === 'WORK' ? 'WORK' : 'BREAK'}
      </h2>
      
      {/* Circular Progress */}
      <div className="relative flex items-center justify-center mb-8 mt-4">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/10"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s linear' }}
            className={`${timerState === 'WORK' ? 'text-rose-400' : 'text-teal-400'}`}
          />
        </svg>
        <span className="absolute text-4xl font-mono font-medium">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
        {!isActive ? (
          <button
            onClick={start}
            className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-95"
            aria-label="Start"
          >
            <Play fill="currentColor" size={24} />
          </button>
        ) : (
          <button
            onClick={pause}
            className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-95"
            aria-label="Pause"
          >
            <Pause fill="currentColor" size={24} />
          </button>
        )}
        <button
          onClick={reset}
          className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-95"
          aria-label="Reset"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      {/* Adjusters */}
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium opacity-80">Work Duration</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWorkDuration(Math.max(1, workDuration - 1))}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-6 text-center font-bold">{workDuration}</span>
            <button
              onClick={() => setWorkDuration(workDuration + 1)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium opacity-80">Break Duration</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBreakDuration(Math.max(1, breakDuration - 1))}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-6 text-center font-bold">{breakDuration}</span>
            <button
              onClick={() => setBreakDuration(breakDuration + 1)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
