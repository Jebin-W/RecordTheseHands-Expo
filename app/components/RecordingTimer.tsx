import { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';

export interface TimerBackgroundStatus {
  background?: string;
  paused?: boolean;
  reset?: boolean;
}

export default function RecordingTimer({
  background = 'bg-red-800',
  paused = false,
  reset = false,
}: TimerBackgroundStatus) {
  const [recordingTime, setRecordingTime] = useState<string>('00:00');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!paused) {
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const totalElapsed = pausedTimeRef.current + currentElapsed;
          setRecordingTime(formatRecordingTime(totalElapsed));
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (startTimeRef.current) {
        const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        pausedTimeRef.current += currentElapsed;
        startTimeRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [paused]);

  useEffect(() => {
    if (reset) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setRecordingTime('00:00');
      pausedTimeRef.current = 0;
      startTimeRef.current = null;
    }
  }, [reset]);

  return (
    <View
      className={`absolute top-2 z-10 flex w-2/10 items-center justify-center rounded-full ${background} opacity-75`}>
      <Text className="font font-extrabold text-white">{recordingTime}</Text>
    </View>
  );
}

function formatRecordingTime(secondsElapsed: number): string {
  const minutesElapsed = Math.floor(secondsElapsed / 60)
    .toString()
    .padStart(2, '0');
  const secondsRemainder = (secondsElapsed % 60).toString().padStart(2, '0');
  return `${minutesElapsed}:${secondsRemainder}`;
}
