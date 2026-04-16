// useProgress.ts — localStorage-backed progress tracking
import { useState, useCallback } from "react";

export interface TopicProgress {
  completed: boolean;
  bestScore: number;   // 0–total
  total: number;
  lastAttempt: number; // timestamp
}

export interface ProgressStore {
  topics: Record<string, TopicProgress>;
  lastTopicId: string | null;
  lastSubjectId: string | null;
  todayCount: number;       // topics completed today
  todayDate: string;        // ISO date string
  streak: number;           // consecutive days with at least 1 topic
  lastStreakDate: string;
}

const KEY = "cbc-learn-progress";

function load(): ProgressStore {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ProgressStore;
  } catch { /* ignore */ }
  return {
    topics: {},
    lastTopicId: null,
    lastSubjectId: null,
    todayCount: 0,
    todayDate: "",
    streak: 0,
    lastStreakDate: "",
  };
}

function save(store: ProgressStore) {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch { /* ignore */ }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function useProgress() {
  const [store, setStore] = useState<ProgressStore>(load);

  const recordResult = useCallback(
    (topicId: string, subjectId: string, score: number, total: number) => {
      setStore((prev) => {
        const today = todayISO();
        const existing = prev.topics[topicId];
        const bestScore = Math.max(score, existing?.bestScore ?? 0);

        // streak logic
        let { streak, lastStreakDate, todayCount, todayDate } = prev;
        const isNewDay = todayDate !== today;
        if (isNewDay) {
          // check if yesterday
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yISO = yesterday.toISOString().slice(0, 10);
          streak = lastStreakDate === yISO || lastStreakDate === today ? streak + 1 : 1;
          todayCount = 1;
          todayDate = today;
        } else {
          todayCount = todayCount + 1;
        }

        const next: ProgressStore = {
          ...prev,
          topics: {
            ...prev.topics,
            [topicId]: {
              completed: true,
              bestScore,
              total,
              lastAttempt: Date.now(),
            },
          },
          lastTopicId: topicId,
          lastSubjectId: subjectId,
          todayCount,
          todayDate,
          streak,
          lastStreakDate: today,
        };
        save(next);
        return next;
      });
    },
    []
  );

  const getTopicProgress = useCallback(
    (topicId: string): TopicProgress | null =>
      store.topics[topicId] ?? null,
    [store]
  );

  return { store, recordResult, getTopicProgress };
}
