// TopicListScreen.tsx

import type { Grade, Term, Subject, Topic } from "../../types";
import { getTopicsBySubject } from "../../data/topics";
import "../../styles/learn.css";

interface TopicListScreenProps {
  grade: Grade;
  term: Term;
  subject: Subject;
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void;
}

const GRADE_EMOJI: Record<Grade, string> = { 1: "🐣", 2: "🐥", 3: "🐓" };
const TERM_LABEL:  Record<Term,  string> = { 1: "Term 1", 2: "Term 2", 3: "Term 3" };

export default function TopicListScreen({ grade, term, subject, onSelectTopic, onBack }: TopicListScreenProps) {
  const topics = getTopicsBySubject(subject.id);

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
            <span className="lrn-breadcrumb-sep">·</span>
            <span>{subject.icon} {subject.label}</span>
          </div>
        </div>

        <div className="lrn-select-heading lrn-anim-up" style={{ animationDelay: "0.05s" }}>
          <h1 className="lrn-select-title">Topics</h1>
          <p className="lrn-select-sub">{topics.length} topics · Read first, then quiz yourself</p>
        </div>

        <div className="lrn-topic-list">
          {topics.map((topic, i) => (
            <button
              key={topic.id}
              className="lrn-topic-card"
              onClick={() => onSelectTopic(topic)}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="lrn-topic-num">{i + 1}</div>
              <div className="lrn-topic-emoji">{topic.emoji}</div>
              <div className="lrn-topic-info">
                <div className="lrn-topic-title">{topic.title}</div>
                <div className="lrn-topic-summary">{topic.summary.split("\n\n")[0].slice(0, 120)}…</div>
                <div className="lrn-topic-meta">
                  <span className="lrn-chip">📖 {topic.readMins} min</span>
                  <span className="lrn-chip">❓ {topic.questions.length} questions</span>
                </div>
              </div>
              <div className="lrn-topic-arrow">→</div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
