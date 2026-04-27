export type AnswerOption = 'A' | 'B' | 'C';
export type DimensionKey = 'F1' | 'F2' | 'E1' | 'E2' | 'S1' | 'S2' | 'A1' | 'A2';
export type PersonaCode =
  | 'GOAT'
  | 'FANA'
  | 'GURU'
  | 'SOFA'
  | 'RIOT'
  | 'MUTE'
  | 'YOLO'
  | 'VIBE'
  | 'SALT'
  | 'JINX'
  | 'MOOD'
  | 'CLIP'
  | 'CHEF'
  | 'MONK'
  | 'SOUL'
  | 'DRIP'
  | 'TROL'
  | 'HERO';

export interface QuestionOption {
  key: AnswerOption;
  text: string;
  score: 1 | 2 | 3;
}

export interface QuestionItem {
  id: number;
  dimension: DimensionKey;
  title: string;
  options: QuestionOption[];
}

export interface PersonaMeta {
  code: PersonaCode;
  name: string;
  copy: string;
  vector?: number[];
  tags: string[];
  star: string;
  enemy: PersonaCode;
  partner: PersonaCode;
  color: string;
  isHidden?: boolean;
}

export interface PersonalityResult {
  personality_code: PersonaCode;
  personality_name: string;
  personality_copy: string;
  answers: AnswerOption[];
  raw_scores: Record<DimensionKey, number>;
  level_vector: number[];
  computed_at: string;
  is_hidden: boolean;
  tags: string[];
  star: string;
  enemy: PersonaCode;
  partner: PersonaCode;
}

export interface QuizDraft {
  version: 1;
  answers: AnswerOption[];
  currentIndex: number;
  updatedAt: number;
}
