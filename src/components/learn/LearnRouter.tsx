// LearnRouter.tsx
// Flow: Grade → Term → Subject → Topic List → Read → Quick Quiz → Result

import { useState } from "react";
import type { Grade, Term, Subject, Topic, QuickResult } from "../../types";
import { getTopicsBySubject } from "../../data/topics";

import GradeSelectScreen from "./GradeSelectScreen";
import TermSelectScreen  from "./TermSelectScreen";
import SubjectScreen     from "./SubjectScreen";
import TopicListScreen   from "./TopicListScreen";
import TopicReadScreen   from "./TopicReadScreen";
import QuickQuizScreen   from "./QuickQuizScreen";
import QuickResultScreen from "./QuickResultScreen";

type Screen = "grade" | "term" | "subjects" | "topics" | "read" | "quiz" | "result";

export default function LearnRouter() {
  const [screen,  setScreen]  = useState<Screen>("grade");
  const [grade,   setGrade]   = useState<Grade   | null>(null);
  const [term,    setTerm]    = useState<Term    | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topic,   setTopic]   = useState<Topic   | null>(null);
  const [result,  setResult]  = useState<QuickResult | null>(null);

  const goNextTopic = () => {
    if (!subject || !topic) { setScreen("topics"); return; }
    const topics = getTopicsBySubject(subject.id);
    const idx    = topics.findIndex((t) => t.id === topic.id);
    const next   = topics[idx + 1];
    if (next) {
      setResult(null);
      setTopic(next);
      setScreen("read");
    } else {
      setResult(null);
      setTopic(null);
      setScreen("topics");
    }
  };

  return (
    <>
      {screen === "grade" && (
        <GradeSelectScreen
          onContinue={(g) => { setGrade(g); setScreen("term"); }}
        />
      )}

      {screen === "term" && grade !== null && (
        <TermSelectScreen
          grade={grade}
          onSelect={(t) => { setTerm(t); setScreen("subjects"); }}
          onBack={() => setScreen("grade")}
        />
      )}

      {screen === "subjects" && grade !== null && term !== null && (
        <SubjectScreen
          grade={grade}
          term={term}
          onSelect={(s) => { setSubject(s); setScreen("topics"); }}
          onBack={() => setScreen("term")}
        />
      )}

      {screen === "topics" && grade !== null && term !== null && subject !== null && (
        <TopicListScreen
          grade={grade}
          term={term}
          subject={subject}
          onSelectTopic={(t) => { setTopic(t); setScreen("read"); }}
          onBack={() => setScreen("subjects")}
        />
      )}

      {screen === "read" && grade !== null && term !== null && subject !== null && topic !== null && (
        <TopicReadScreen
          grade={grade}
          term={term}
          subject={subject}
          topic={topic}
          onStartQuiz={() => setScreen("quiz")}
          onBack={() => setScreen("topics")}
        />
      )}

      {screen === "quiz" && topic !== null && (
        <QuickQuizScreen
          topic={topic}
          onFinish={(r) => { setResult(r); setScreen("result"); }}
          onBack={() => setScreen("read")}
        />
      )}

      {screen === "result" && topic !== null && result !== null && (
        <QuickResultScreen
          topic={topic}
          result={result}
          onRetry={() => { setResult(null); setScreen("read"); }}
          onNextTopic={goNextTopic}
          onBackToTopics={() => { setResult(null); setTopic(null); setScreen("topics"); }}
          onBackToSubjects={() => { setResult(null); setTopic(null); setSubject(null); setScreen("subjects"); }}
        />
      )}
    </>
  );
}
