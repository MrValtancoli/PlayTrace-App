import { useEffect } from 'react';
import { useMatchStore } from '../store/matchStore';

/** Drives the 1-second timer tick while the match clock is running. */
export function useTimer(): void {
  const isRunning = useMatchStore((s) => s.isRunning);
  const tick = useMatchStore((s) => s.tick);

  useEffect(() => {
    if (!isRunning) return;
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isRunning, tick]);
}
