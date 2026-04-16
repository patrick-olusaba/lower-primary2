import { useState } from "react";
import type { Grade } from "../../types";
import "../../styles/GradeSelectScreen.css";
import heroImage from "../../assets/hero.png";

interface GradeSelectScreenProps {
  onContinue: (grade: Grade) => void;
}

const GRADE_OPTIONS = [
  { grade: 1 as Grade, emoji: "🐣", label: "Grade 1", desc: "Ages 6–7 · Foundation year" },
  { grade: 2 as Grade, emoji: "🐥", label: "Grade 2", desc: "Ages 7–8 · Building skills" },
  { grade: 3 as Grade, emoji: "🐓", label: "Grade 3", desc: "Ages 8–9 · Growing strong" },
];

export default function GradeSelectScreen({ onContinue }: GradeSelectScreenProps) {
  const [selected, setSelected] = useState<Grade | null>(null);

  return (
    <div className="lower-gs-wrapper">
      <div className="lower-gs-card">

        <p className="lower-gs-app-title">CBC Lower Primary</p>
        <h1 className="lower-gs-title">Select Your Grade</h1>
        <p className="lower-gs-subtitle">Choose your current grade level to get started.</p>

        <div className="lower-gs-hero">
          <img src={heroImage} alt="Children learning" />
        </div>

        <div className="lower-gs-options">
          {GRADE_OPTIONS.map(({ grade, emoji, label, desc }) => {
            const isSelected = selected === grade;
            return (
              <button
                key={grade}
                className={`lower-gs-option ${isSelected ? "active" : ""}`}
                onClick={() => setSelected(grade)}
              >
                <div className="lower-gs-option-inner">
                  <span className="lower-gs-option-emoji">{emoji}</span>
                  <div>
                    <div className="lower-gs-option-label">{label}</div>
                    <div className="lower-gs-option-desc">{desc}</div>
                  </div>
                </div>
                {isSelected && <div className="lower-gs-check">✓</div>}
              </button>
            );
          })}
        </div>

        <button
          className="lower-gs-continue"
          disabled={!selected}
          onClick={() => selected && onContinue(selected)}
        >
          Continue →
        </button>

      </div>
    </div>
  );
}
