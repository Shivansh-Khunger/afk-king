import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerState = 'WORK' | 'BREAK';

interface PomodoroHook {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
  timerState: TimerState;
  workDuration: number;
  breakDuration: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setWorkDuration: (mins: number) => void;
  setBreakDuration: (mins: number) => void;
}

export const usePomodoro = (defaultWork = 25, defaultBreak = 5, useSeconds = false): PomodoroHook => {
  const multiplier = useSeconds ? 1 : 60;
  const [workDuration, setWorkDuration] = useState(defaultWork);
  const [breakDuration, setBreakDuration] = useState(defaultBreak);
  const [timerState, setTimerState] = useState<TimerState>('WORK');
  const [timeLeft, setTimeLeft] = useState(defaultWork * multiplier);
  const [isActive, setIsActive] = useState(false);
  
  const totalTime = timerState === 'WORK' ? workDuration * multiplier : breakDuration * multiplier;

  const intervalRef = useRef<any>(null);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  
  const reset = useCallback(() => {
    setIsActive(false);
    setTimerState('WORK');
    setTimeLeft(workDuration * multiplier);
  }, [workDuration, multiplier]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Transition state
      if (timerState === 'WORK') {
        setTimerState('BREAK');
        setTimeLeft(breakDuration * multiplier);
      } else {
        setTimerState('WORK');
        setTimeLeft(workDuration * multiplier);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, timerState, workDuration, breakDuration, multiplier]);

  // Update timeLeft when durations change if not active
  useEffect(() => {
    if (!isActive) {
      if (timerState === 'WORK') {
        setTimeLeft(workDuration * multiplier);
      } else {
        setTimeLeft(breakDuration * multiplier);
      }
    }
  }, [workDuration, breakDuration, timerState, isActive, multiplier]);

  return {
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
  };
};
