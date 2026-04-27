import { describe, expect, it } from 'vitest';
import { routes } from '@/app/router';
import { QUESTIONS } from '@/domains/questionBank';
import { computePersonality } from '@/domains/personalityEngine';
import { getLatestLocalResult, saveLatestLocalResult } from '@/services/localRepository';
import type { AnswerOption } from '@/domains/types';

function createMemoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => Array.from(data.keys())[index] ?? null,
    removeItem: (key) => data.delete(key),
    setItem: (key, value) => {
      data.set(key, value);
    }
  };
}

describe('main flow shell', () => {
  it('registers landing, quiz, calculating, result and status pages', () => {
    expect(routes.map((route) => route.name)).toEqual(['landing', 'quiz', 'calculating', 'result', 'status']);
  });

  it('can compute and cache a full 16-answer result for the result page', () => {
    expect(QUESTIONS).toHaveLength(16);
    const answers = QUESTIONS.map((_, index) => (index % 3 === 0 ? 'A' : index % 3 === 1 ? 'B' : 'C')) as AnswerOption[];
    const result = computePersonality(answers, new Date('2026-04-27T07:25:00.000Z'));
    const storage = createMemoryStorage();
    saveLatestLocalResult(result, storage);
    expect(getLatestLocalResult(storage)?.answers).toHaveLength(16);
  });
});
