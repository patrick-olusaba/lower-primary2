// SubjectScreen.tsx — pick a subject

import type { Grade, Term, Subject } from "../../types";
import { SUBJECTS } from "../../data/subjects";
import { getTopicsBySubject } from "../../data/topics";
import "../../styles/learn.css";

interface SubjectScreenProps {
  grade: Grade;
  term: Term;
  onSelect: (subject: Subject) => void;
  onBack: () => void;
}

const GRADE_EMOJI: Record<Grade, string> = { 1: "🐣", 2: "🐥", 3: "🐓" };
const TERM_LABEL:  Record<Term,  string> = { 1: "Term 1", 2: "Term 2", 3: "Term 3" };

export default function SubjectScreen({ grade, term, onSelect, onBack }: SubjectScreenProps) {
  return (
    <div className="lrn-screen">
      <div className="lrn-inner">

        <div className="lrn-header lrn-anim-up">
          <button className="lrn-back" onClick={onBack}>← Back</button>
          <div className="lrn-breadcrumb">
            <span>{GRADE_EMOJI[grade]}</span>
            <span>Grade {grade}</span>
            <span className="lrn-breadcrumb-sep">·</span>
            <span>{TERM_LABEL[term]}</span>
          </div>
        </div>

        <div className="lrn-select-heading lrn-anim-up" style={{ animationDelay: "0.05s" }}>
          <h1 className="lrn-select-title">Pick a Subject</h1>
          <p className="lrn-select-sub">Tap any card to explore topics</p>
        </div>

        <div className="lrn-subject-grid">
          {SUBJECTS.map((subject, i) => {
            const topicCount = getTopicsBySubject(subject.id).length;
            return (
              <button
                key={subject.id}
                className="lrn-subject-card"
                data-subject={subject.id}
                onClick={() => onSelect(subject)}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="lrn-subject-top">
                  <span className="lrn-subject-icon">{subject.icon}</span>
                  <span className="lrn-subject-count">{topicCount}</span>
                </div>
                <div className="lrn-subject-body">
                  <span className="lrn-subject-name">{subject.label}</span>
                  <span className="lrn-subject-desc">{subject.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
