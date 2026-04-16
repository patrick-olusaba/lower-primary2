// QuickResultScreen.tsx — score + answer review

import type { Topic, QuickResult } from "../../types";
import "../../styles/learn.css";

interface QuickResultScreenProps {
  topic: Topic;
  result: QuickResult;
  onRetry: () => void;
  onNextTopic: () => void;
  onBackToTopics: () => void;
  onBackToSubjects: () => void;
}

export default function QuickResultScreen({
  topic, result, onRetry, onNextTopic, onBackToTopics, onBackToSubjects,
}: QuickResultScreenProps) {
  const pct     = Math.round((result.score / result.total) * 100);
  const perfect = pct === 100;
  const passed  = pct >= 67;

  const badge = perfect
    ? { emoji: "🏆", title: "Perfect Score!", cls: "lrn-badge-gold"   }
    : passed
    ? { emoji: "🌟", title: "Well Done!",      cls: "lrn-badge-purple" }
    : { emoji: "📚", title: "Keep Practising!", cls: "lrn-badge-grey"  };

  return (
    <div className="lrn-screen">
      <div className="lrn-inner lrn-inner-result">

        {/* Badge */}
        <div className={`lrn-result-badge ${badge.cls} lrn-anim-bounce`}>
          <div className="lrn-result-emoji">{badge.emoji}</div>
          <div className="lrn-result-badge-title">{badge.title}</div>
        </div>

        {/* Score */}
        <div className="lrn-result-score-wrap">
          <div className="lrn-result-ring">
            <div className="lrn-result-pct">{pct}%</div>
            <div className="lrn-result-pct-label">Score</div>
          </div>
          <div className="lrn-result-tally">
            <div className="lrn-result-topic-name">{topic.emoji} {topic.title}</div>
            <div className="lrn-tally-row">
              <span className="lrn-tally-correct">{result.score}</span>
              <span>Correct</span>
            </div>
            <div className="lrn-tally-row">
              <span className="lrn-tally-wrong">{result.total - result.score}</span>
              <span>Wrong</span>
            </div>
          </div>
        </div>

        {/* Answer review */}
        <div className="lrn-review">
          <h3 className="lrn-review-title">📋 Answer Review</h3>
          {result.answers.map((ans, i) => {
            const q = topic.questions[i];
            return (
              <div
                key={i}
                className={`lrn-review-item ${ans.isCorrect ? "lrn-review-correct" : "lrn-review-wrong"}`}
              >
                <div className="lrn-review-icon">{ans.isCorrect ? "✓" : "✗"}</div>
                <div className="lrn-review-body">
                  <div className="lrn-review-q">{q.q}</div>
                  {!ans.isCorrect && (
                    <div className="lrn-review-correct-ans">
                      Correct: <strong>{q.opts[q.ans]}</strong>
                    </div>
                  )}
                  <div className="lrn-review-hint">{q.hint}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="lrn-result-actions">
          <button className="lrn-btn-outline" onClick={onRetry}>🔄 Retry</button>
          <button className="lrn-btn-outline" onClick={onBackToTopics}>📖 Topics</button>
          <button className="lrn-btn-primary lrn-btn-full" onClick={onNextTopic}>
            ➡️ Next Topic
          </button>
          <button className="lrn-btn-outline lrn-btn-full" onClick={onBackToSubjects}>
            📚 All Subjects
          </button>
        </div>

      </div>
    </div>
  );
}
