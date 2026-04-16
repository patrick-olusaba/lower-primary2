// QuickQuizScreen.tsx — quiz with live score tally

import { useState } from "react";
import type { Topic, QuickResult } from "../../types";
import "../../styles/learn.css";

interface QuickQuizScreenProps {
  topic: Topic;
  onFinish: (result: QuickResult) => void;
  onBack: () => void;
}

const LABELS = ["A", "B", "C", "D"] as const;
type AnswerState = "unanswered" | "correct" | "wrong";

export default function QuickQuizScreen({ topic, onFinish, onBack }: QuickQuizScreenProps) {
  const questions = topic.questions;
  const total     = questions.length;

  const [current,  setCurrent]  = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [state,    setState]    = useState<AnswerState>("unanswered");
  const [answers,  setAnswers]  = useState<
    { selected: number; correct: number; isCorrect: boolean }[]
  >([]);
  const [animKey, setAnimKey] = useState(0);

  const q           = questions[current];
  const isAnswered  = state !== "unanswered";
  const progressPct = Math.round(((current + (isAnswered ? 1 : 0)) / total) * 100);
  const correctSoFar = answers.filter((a) => a.isCorrect).length;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    const isCorrect = idx === q.ans;
    setSelected(idx);
    setState(isCorrect ? "correct" : "wrong");
    setAnswers((prev) => [...prev, { selected: idx, correct: q.ans, isCorrect }]);
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      setAnswers((prev) => {
        const score = prev.filter((a) => a.isCorrect).length;
        onFinish({ topicId: topic.id, score, total, answers: prev });
        return prev;
      });
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setState("unanswered");
      setAnimKey((k) => k + 1);
    }
  };

  const getOptClass = (idx: number): string => {
    if (!isAnswered)      return "lrn-opt";
    if (idx === q.ans)    return "lrn-opt lrn-opt-correct";
    if (idx === selected) return "lrn-opt lrn-opt-wrong";
    return "lrn-opt lrn-opt-dim";
  };

  return (
    <div className="lrn-screen">
      <div className="lrn-inner">

        {/* Header */}
        <div className="lrn-header lrn-anim-up">
          <button className="lrn-back" onClick={onBack}>← Back</button>
          <div className="lrn-breadcrumb">
            <span>{topic.emoji}</span>
            <span>{topic.title}</span>
          </div>
          {/* Live score */}
          <div className="lrn-quiz-score-pill">
            ⭐ {correctSoFar}/{current + (isAnswered ? 1 : 0)}
          </div>
        </div>

        {/* Progress */}
        <div className="lrn-quiz-progress">
          <div className="lrn-quiz-progress-label">
            <span>Question {current + 1} of {total}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="lrn-progress-track">
            <div className="lrn-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="lrn-q-card" key={animKey}>
          <div className="lrn-q-num">{current + 1}</div>
          <p className="lrn-q-text">{q.q}</p>
        </div>

        {/* Options */}
        <div className="lrn-opts" key={animKey + 100}>
          {q.opts.map((opt, idx) => (
            <button
              key={idx}
              className={getOptClass(idx)}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
            >
              <span className="lrn-opt-letter">{LABELS[idx]}</span>
              <span className="lrn-opt-text">{opt}</span>
              {isAnswered && idx === q.ans    && <span className="lrn-opt-icon">✓</span>}
              {isAnswered && idx === selected && idx !== q.ans && <span className="lrn-opt-icon">✗</span>}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className={`lrn-feedback ${state === "correct" ? "lrn-fb-correct" : "lrn-fb-wrong"}`}>
            <div className="lrn-fb-emoji">{state === "correct" ? "🌟" : "💡"}</div>
            <div className="lrn-fb-content">
              <div className="lrn-fb-title">{state === "correct" ? "Correct!" : "Not quite!"}</div>
              <div className="lrn-fb-hint">{q.hint}</div>
            </div>
            <button className="lrn-fb-next" onClick={handleNext}>
              {current + 1 >= total ? "Results →" : "Next →"}
            </button>
          </div>
        )}

        {!isAnswered && <p className="lrn-quiz-hint">Tap an answer to check it ✦</p>}

      </div>
    </div>
  );
}
