// TopicReadScreen.tsx
// Each section shows its chunk of the summary essay, then a 3-question quiz

import { useState } from "react";
import type { Grade, Term, Subject, Topic } from "../../types";
import "../../styles/learn.css";

interface TopicReadScreenProps {
  grade: Grade;
  term: Term;
  subject: Subject;
  topic: Topic;
  onStartQuiz: () => void;
  onBack: () => void;
}

const GRADE_EMOJI: Record<Grade, string> = { 1: "🐣", 2: "🐥", 3: "🐓" };
const TERM_LABEL:  Record<Term,  string> = { 1: "Term 1", 2: "Term 2", 3: "Term 3" };
const LABELS = ["A", "B", "C", "D"] as const;
type SectionState = "read" | "quiz" | "done";

export default function TopicReadScreen({
  grade, term, subject, topic, onStartQuiz, onBack,
}: TopicReadScreenProps) {
  const sections = topic.sections;

  const [current,       setCurrent]      = useState(0);
  const [sectionStates, setSectionStates] = useState<SectionState[]>(sections.map(() => "read"));
  const [qIndex,        setQIndex]       = useState(0);
  const [selected,      setSelected]     = useState<number | null>(null);
  const [answered,      setAnswered]     = useState(false);
  const [isCorrect,     setIsCorrect]    = useState(false);
  const [sectionScore,  setSectionScore] = useState(0);

  const section   = sections[current];
  const questions = section?.questions ?? [];
  const question  = questions[qIndex];
  const state     = sectionStates[current];
  const allDone   = sectionStates.every((s) => s === "done");

  // Split summary essay into paragraphs and distribute across sections
  const allParas   = topic.summary.split("\n\n").filter(Boolean);
  const perSection = Math.ceil(allParas.length / sections.length);
  const sectionParas = (i: number) =>
    allParas.slice(i * perSection, (i + 1) * perSection);

  const goToSection = (i: number) => {
    if (i > 0 && sectionStates[i - 1] !== "done") return;
    setCurrent(i);
    setQIndex(0);
    setSelected(null);
    setAnswered(false);
    setSectionScore(0);
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    const correct = idx === question.ans;
    setSelected(idx);
    setAnswered(true);
    setIsCorrect(correct);
    if (correct) setSectionScore((s) => s + 1);
  };

  const handleNextQuestion = () => {
    const nextQ = qIndex + 1;
    if (nextQ < questions.length) {
      setQIndex(nextQ);
      setSelected(null);
      setAnswered(false);
    } else {
      setSectionStates((prev) => {
        const next = [...prev];
        next[current] = "done";
        return next;
      });
    }
  };

  const showQuiz = () => {
    setSectionStates((prev) => {
      const next = [...prev];
      next[current] = "quiz";
      return next;
    });
  };

  const getOptClass = (idx: number) => {
    if (!answered)            return "lrn-opt";
    if (idx === question.ans) return "lrn-opt lrn-opt-correct";
    if (idx === selected)     return "lrn-opt lrn-opt-wrong";
    return "lrn-opt lrn-opt-dim";
  };

  return (
    <div className="lrn-screen lrn-screen-wide">
      <div className="lrn-read-layout">

        {/* ── TOC Sidebar ── */}
        <aside className="lrn-toc lrn-anim-up">
          <div className="lrn-toc-header">
            <span className="lrn-toc-emoji">{topic.emoji}</span>
            <div>
              <div className="lrn-toc-title">{topic.title}</div>
              <div className="lrn-toc-sub">{sections.length} sections</div>
            </div>
          </div>

          <nav className="lrn-toc-list">
            {sections.map((sec, i) => {
              const secState = sectionStates[i];
              const locked   = i > 0 && sectionStates[i - 1] !== "done";
              const isActive = current === i;
              return (
                <button
                  key={i}
                  className={`lrn-toc-item ${isActive ? "lrn-toc-active" : ""} ${locked ? "lrn-toc-locked" : ""}`}
                  onClick={() => goToSection(i)}
                  disabled={locked}
                >
                  <span className="lrn-toc-num">{secState === "done" ? "✓" : i + 1}</span>
                  <span className="lrn-toc-label">{sec.heading}</span>
                  {locked && <span className="lrn-toc-lock">🔒</span>}
                </button>
              );
            })}
          </nav>

          {allDone && (
            <button className="lrn-toc-quiz-btn lrn-anim-pop" onClick={onStartQuiz}>
              🏁 Full Quiz
            </button>
          )}

          <button className="lrn-back" style={{ marginTop: "auto" }} onClick={onBack}>
            ← Back
          </button>
        </aside>

        {/* ── Main content card ── */}
        <div className="lrn-inner lrn-inner-wide lrn-section-card lrn-inner-scroll" key={current}>

          {/* Breadcrumb + progress dots */}
          <div className="lrn-header lrn-anim-up">
            <div className="lrn-breadcrumb">
              <span>{GRADE_EMOJI[grade]}</span>
              <span>Grade {grade}</span>
              <span className="lrn-breadcrumb-sep">·</span>
              <span>{TERM_LABEL[term]}</span>
              <span className="lrn-breadcrumb-sep">·</span>
              <span>{subject.icon} {subject.label}</span>
            </div>
            <div className="lrn-section-progress">
              {sections.map((_, i) => (
                <div key={i} className={`lrn-section-dot ${
                  sectionStates[i] === "done" ? "lrn-dot-done" :
                  current === i ? "lrn-dot-active" : "lrn-dot-idle"
                }`} />
              ))}
            </div>
          </div>

          {/* ══ READ ══ */}
          {state !== "quiz" && (
            <>
              <div className="lrn-read-hero lrn-anim-up">
                <div className="lrn-read-emoji">{topic.emoji}</div>
                <div>
                  <div className="lrn-section-label">Section {current + 1} of {sections.length}</div>
                  <h1 className="lrn-read-title">{section.heading}</h1>
                  <div className="lrn-read-meta">
                    <span className="lrn-chip">📖 {sectionParas(current).length} paragraphs</span>
                    <span className="lrn-chip">❓ {questions.length} questions after</span>
                  </div>
                </div>
              </div>

              <div className="lrn-divider" />

              <div className="lrn-summary-essay lrn-anim-up" style={{ animationDelay: "0.08s" }}>
                {sectionParas(current).map((para, i) => (
                  <p key={i} className="lrn-summary-para">{para}</p>
                ))}
              </div>

              <div className="lrn-divider" />

              {state === "read" && (
                <button className="lrn-start-btn lrn-anim-up" style={{ animationDelay: "0.14s" }} onClick={showQuiz}>
                  Check Your Understanding →
                </button>
              )}

              {state === "done" && (
                <div className="lrn-section-done-banner lrn-anim-up">
                  ✅ Section complete! Score: {sectionScore}/{questions.length}
                  {current + 1 < sections.length && (
                    <button className="lrn-toc-quiz-btn" style={{ marginTop: 10 }} onClick={() => goToSection(current + 1)}>
                      Next Section →
                    </button>
                  )}
                  {allDone && (
                    <button className="lrn-toc-quiz-btn" style={{ marginTop: 10 }} onClick={onStartQuiz}>
                      🏁 Take Full Quiz
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* ══ QUIZ ══ */}
          {state === "quiz" && (
            <>
              <div className="lrn-read-hero lrn-anim-up">
                <div className="lrn-read-emoji">❓</div>
                <div>
                  <div className="lrn-section-label">
                    Quick Check · Section {current + 1} · Q{qIndex + 1} of {questions.length}
                  </div>
                  <h1 className="lrn-read-title">{section.heading}</h1>
                </div>
              </div>

              <div className="lrn-q-card lrn-anim-pop">
                <div className="lrn-q-num">{qIndex + 1}</div>
                <p className="lrn-q-text">{question.q}</p>
              </div>

              <div className="lrn-opts">
                {question.opts.map((opt, idx) => (
                  <button
                    key={idx}
                    className={getOptClass(idx)}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                  >
                    <span className="lrn-opt-letter">{LABELS[idx]}</span>
                    <span className="lrn-opt-text">{opt}</span>
                    {answered && idx === question.ans && <span className="lrn-opt-icon">✓</span>}
                    {answered && idx === selected && idx !== question.ans && <span className="lrn-opt-icon">✗</span>}
                  </button>
                ))}
              </div>

              {answered && (
                <div className={`lrn-feedback ${isCorrect ? "lrn-fb-correct" : "lrn-fb-wrong"} lrn-anim-bounce`}>
                  <div className="lrn-fb-emoji">{isCorrect ? "🌟" : "💡"}</div>
                  <div className="lrn-fb-content">
                    <div className="lrn-fb-title">{isCorrect ? "Correct!" : "Not quite!"}</div>
                    <div className="lrn-fb-hint">{question.hint}</div>
                  </div>
                  <button className="lrn-fb-next" onClick={handleNextQuestion}>
                    {qIndex + 1 >= questions.length ? "Finish Section →" : `Next Q (${qIndex + 1}/${questions.length}) →`}
                  </button>
                </div>
              )}

              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 4 }}>
                {questions.map((_, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: i < qIndex ? "var(--purple)" : i === qIndex ? "var(--purple-mid)" : "var(--purple-pale)",
                    transition: "background 0.2s",
                  }} />
                ))}
              </div>

              {!answered && <p className="lrn-quiz-hint">Tap an answer to check it ✦</p>}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
