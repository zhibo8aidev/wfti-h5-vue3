import { DIMENSIONS, PERSONAS, QUESTIONS, REGULAR_PERSONA_ORDER } from './questionBank';
import type { AnswerOption, DimensionKey, PersonalityResult, PersonaCode } from './types';

const ANSWER_SCORE: Record<AnswerOption, 1 | 2 | 3> = {
  A: 1,
  B: 2,
  C: 3
};

const QUESTION_COUNT = 16;

export function validateAnswers(answers: AnswerOption[]): void {
  if (answers.length !== QUESTION_COUNT) {
    throw new Error(`WFTI requires ${QUESTION_COUNT} answers, received ${answers.length}`);
  }
  answers.forEach((answer, index) => {
    if (!ANSWER_SCORE[answer]) {
      throw new Error(`Invalid answer at question ${index + 1}: ${String(answer)}`);
    }
  });
}

export function computeRawScores(answers: AnswerOption[]): Record<DimensionKey, number> {
  validateAnswers(answers);
  const raw = Object.fromEntries(DIMENSIONS.map((dimension) => [dimension, 0])) as Record<DimensionKey, number>;

  answers.forEach((answer, index) => {
    const question = QUESTIONS[index];
    raw[question.dimension] += ANSWER_SCORE[answer];
  });

  return raw;
}

export function scoreToLevel(score: number): 1 | 2 | 3 {
  if (score >= 2 && score <= 3) return 1;
  if (score === 4) return 2;
  if (score >= 5 && score <= 6) return 3;
  throw new Error(`Invalid dimension score: ${score}`);
}

export function rawScoresToVector(rawScores: Record<DimensionKey, number>): number[] {
  return DIMENSIONS.map((dimension) => scoreToLevel(rawScores[dimension]));
}

export function detectHiddenPersona(answers: AnswerOption[]): PersonaCode | null {
  validateAnswers(answers);
  const isTrol = answers[2] === 'A' && answers[11] === 'C' && answers[8] === 'A';
  if (isTrol) return 'TROL';

  const isHero = answers[12] === 'A' && answers[15] === 'C' && answers[6] === 'C';
  if (isHero) return 'HERO';

  return null;
}

export function manhattanDistance(left: number[], right: number[]): number {
  if (left.length !== right.length) {
    throw new Error('Vector length mismatch');
  }
  return left.reduce((total, value, index) => total + Math.abs(value - right[index]), 0);
}

export function matchClosestPersona(levelVector: number[]): PersonaCode {
  return REGULAR_PERSONA_ORDER.reduce(
    (best, code) => {
      const vector = PERSONAS[code].vector;
      if (!vector) return best;
      const distance = manhattanDistance(levelVector, vector);
      if (distance < best.distance) {
        return { code, distance };
      }
      return best;
    },
    { code: REGULAR_PERSONA_ORDER[0], distance: Number.POSITIVE_INFINITY }
  ).code;
}

export function computePersonality(answers: AnswerOption[], now = new Date()): PersonalityResult {
  validateAnswers(answers);
  const raw_scores = computeRawScores(answers);
  const level_vector = rawScoresToVector(raw_scores);
  const hiddenCode = detectHiddenPersona(answers);
  const code = hiddenCode ?? matchClosestPersona(level_vector);
  const persona = PERSONAS[code];

  return {
    personality_code: persona.code,
    personality_name: persona.name,
    personality_copy: persona.copy,
    answers: [...answers],
    raw_scores,
    level_vector,
    computed_at: now.toISOString(),
    is_hidden: Boolean(hiddenCode),
    tags: persona.tags,
    star: persona.star,
    enemy: persona.enemy,
    partner: persona.partner
  };
}
