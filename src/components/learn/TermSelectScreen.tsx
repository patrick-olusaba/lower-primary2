// TermSelectScreen.tsx — pick Term 1 / 2 / 3

import { useState } from "react";
import type { Grade, Term } from "../../types";
import "../../styles/learn.css";

interface TermSelectScreenProps {
  grade: Grade;
  onSelect: (term: Term) => void;
  onBack: () => void;
}

const TERMS: { term: Term; label: string; emoji: string; desc: string }[] = [
  { term: 1, label: "Term 1", emoji: "🌱", desc: "Jan – Apr  ·  Start of year" },
  { term: 2, label: "Term 2", emoji: "📘", desc: "May – Aug  ·  Mid year"      },
  { term: 3, label: "Term 3", emoji: "🏆", desc: "Sep – Nov  ·  End of year"   },
];

const GRADE_EMOJI: Record<Grade, string> = { 1: "🐣", 2: "🐥", 3: "🐓" };

export default function TermSelectScreen({ grade, onSelect, onBack }: TermSelectScreenProps) {
  const [selected, setSelected] = useState<Term | null>(null);

  return (
    <div className="lrn-screen">
      <div className="lrn-inner lrn-inner-sm">

        {/* Header */}
        <div className="lrn-header lrn-anim-up">
          <button className="lrn-back" onClick={onBack}>← Back</button>
          <div className="lrn-breadcrumb">
            <span>{GRADE_EMOJI[grade]}</span>
            <span>Grade {grade}</span>
          </div>
        </div>

        {/* Heading */}
        <div className="lrn-select-heading">
          <h2 className="lrn-select-title">Select Your Term</h2>
          <p className="lrn-select-sub">Which school term are you studying?</p>
        </div>

        {/* Term buttons */}
        <div className="lrn-option-list">
          {TERMS.map(({ term, label, emoji, desc }, i) => {
            const isActive = selected === term;
            return (
              <button
                key={term}
                className={`lrn-option-btn ${isActive ? "lrn-option-active" : ""}`}
                onClick={() => setSelected(term)}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="lrn-option-icon lrn-option-icon-lg">{emoji}</div>
                <div className="lrn-option-text">
                  <div className="lrn-option-label">{label}</div>
                  <div className="lrn-option-sub">{desc}</div>
                </div>
                {isActive && <div className="lrn-option-check">✓</div>}
              </button>
            );
          })}
        </div>

        {/* Continue */}
        <button
          className="lrn-continue-btn"
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
        >
          Continue →
        </button>

      </div>
    </div>
  );
}
