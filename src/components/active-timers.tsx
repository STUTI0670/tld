'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimeDebt } from '@/hooks/use-time-debt';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Check } from 'lucide-react';
import { formatMinutesToHM } from '@/lib/utils';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="text-center">
      <p className="text-4xl font-bold tracking-tighter">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p className="text-xs text-muted-foreground">
        {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
}

function Stopwatch() {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const countRef = useRef<NodeJS.Timeout | null>(null);
    const { repayDebt } = useTimeDebt();
    const { toast } = useToast();

    const handleStart = () => {
        setIsActive(true);
        countRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        }, 1000);
    };

    const handlePause = () => {
        setIsActive(false);
        if (countRef.current) {
        clearInterval(countRef.current);
        }
    };

    const handleReset = () => {
        setIsActive(false);
        if (countRef.current) {
        clearInterval(countRef.current);
        }
        setTime(0);
    };

    const handleClaim = () => {
        const minutes = Math.floor(time / 60);
        if (minutes > 0) {
            repayDebt(minutes);
            toast({
                title: 'Time Claimed',
                description: `You've repaid ${minutes} minutes of your debt.`,
            });
            handleReset();
        } else {
            toast({
                variant: 'destructive',
                title: 'Not enough time',
                description: 'You need to track at least 1 minute to claim time.',
            });
        }
    };
    
    const formatTime = (timeInSeconds: number) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        return [hours, minutes, seconds]
            .map(val => val.toString().padStart(2, '0'))
            .join(':');
    };

  return (
    <div className="text-center">
      <p className="text-4xl font-bold tracking-tighter tabular-nums">
        {formatTime(time)}
      </p>
       <div className="flex justify-center gap-2 mt-4">
        {!isActive ? (
            <Button onClick={handleStart} size="icon" aria-label="Start stopwatch">
                <Play />
            </Button>
        ) : (
            <Button onClick={handlePause} size="icon" variant="outline" aria-label="Pause stopwatch">
                <Pause />
            </Button>
        )}
        <Button onClick={handleReset} size="icon" variant="outline" disabled={time === 0}>
            <Square />
        </Button>
        <Button onClick={handleClaim} size="icon" variant="secondary" disabled={time < 60}>
            <Check />
        </Button>
      </div>
    </div>
  );
}


export default function ActiveTimers() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Active Timers</CardTitle>
            <CardDescription>Track your focused work and see the current time.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Clock />
            <Stopwatch />
        </CardContent>
    </Card>
  );
}
