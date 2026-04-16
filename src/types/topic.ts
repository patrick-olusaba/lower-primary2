import type { SubjectId } from "./subject";

export interface TopicSection {
  heading: string;
  body: string;
  questions: QuickQuestion[]; // 8-10 per section
}

export interface QuickQuestion {
  q: string;
  opts: [string, string, string, string];
  ans: 0 | 1 | 2 | 3;
  hint: string;
}

export interface Topic {
  id: string;
  subjectId: SubjectId;
  title: string;
  summary: string;
  emoji: string;
  readMins: number;
  sections: TopicSection[];
  questions: QuickQuestion[]; // final quiz — separate from section questions
}

export interface QuickResult {
  topicId: string;
  score: number;
  total: number;
  answers: { selected: number; correct: number; isCorrect: boolean }[];
}
