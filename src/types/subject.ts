export type SubjectId =
  | "literacy"
  | "kiswahili"
  | "english"
  | "mathematics"
  | "environmental"
  | "hygiene"
  | "religious"
  | "movement";

export interface Subject {
  id: SubjectId;
  label: string;
  icon: string;
  desc: string;
}
