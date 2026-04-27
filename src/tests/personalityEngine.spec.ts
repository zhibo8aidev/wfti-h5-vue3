import { describe, expect, it } from 'vitest';
import { computePersonality, computeRawScores, detectHiddenPersona, matchClosestPersona, rawScoresToVector } from '@/domains/personalityEngine';
import type { AnswerOption } from '@/domains/types';

const fill = (answer: AnswerOption): AnswerOption[] => Array.from({ length: 16 }, () => answer);

describe('personalityEngine', () => {
  it('keeps the 16-question scoring and vector mapping deterministic', () => {
    const raw = computeRawScores(fill('B'));
    expect(raw).toEqual({ F1: 4, F2: 4, E1: 4, E2: 4, S1: 4, S2: 4, A1: 4, A2: 4 });
    expect(rawScoresToVector(raw)).toEqual([2, 2, 2, 2, 2, 2, 2, 2]);
  });

  it('returns TROL when the hidden TROL trigger is matched', () => {
    const answers = fill('B');
    answers[2] = 'A';
    answers[11] = 'C';
    answers[8] = 'A';
    expect(detectHiddenPersona(answers)).toBe('TROL');
    expect(computePersonality(answers).personality_code).toBe('TROL');
  });

  it('returns HERO when the hidden HERO trigger is matched', () => {
    const answers = fill('B');
    answers[12] = 'A';
    answers[15] = 'C';
    answers[6] = 'C';
    expect(detectHiddenPersona(answers)).toBe('HERO');
    expect(computePersonality(answers).personality_code).toBe('HERO');
  });

  it('prioritizes TROL over HERO when both hidden triggers are matched', () => {
    const answers = fill('B');
    answers[2] = 'A';
    answers[11] = 'C';
    answers[8] = 'A';
    answers[12] = 'A';
    answers[15] = 'C';
    answers[6] = 'C';
    expect(computePersonality(answers).personality_code).toBe('TROL');
  });

  it('uses configured tie order for regular persona distance matching', () => {
    expect(matchClosestPersona([2, 2, 2, 2, 2, 2, 2, 2])).toBe('YOLO');
  });

  it('rejects incomplete or invalid answer payloads', () => {
    expect(() => computePersonality(fill('A').slice(0, 15))).toThrow(/16 answers/);
    expect(() => computePersonality([...fill('A').slice(0, 15), 'D' as AnswerOption])).toThrow(/Invalid answer/);
  });
});
