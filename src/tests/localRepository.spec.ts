import { beforeEach, describe, expect, it } from 'vitest';
import { clearLatestLocalResult, clearQuizDraft, DRAFT_KEY, getLatestLocalResult, getQuizDraft, saveLatestLocalResult, saveQuizDraft } from '@/services/localRepository';
import { computePersonality } from '@/domains/personalityEngine';
import type { AnswerOption } from '@/domains/types';

function createMemoryStorage(): Storage {
  let data: Record<string, string> = {};
  return {
    get length() {
      return Object.keys(data).length;
    },
    clear() {
      data = {};
    },
    getItem(key: string) {
      return data[key] ?? null;
    },
    key(index: number) {
      return Object.keys(data)[index] ?? null;
    },
    removeItem(key: string) {
      delete data[key];
    },
    setItem(key: string, value: string) {
      data[key] = value;
    }
  };
}

describe('localRepository', () => {
  let storage: Storage;
  const now = Date.parse('2026-04-27T07:25:00.000Z');

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it('stores and restores a 24-hour quiz draft', () => {
    saveQuizDraft({ answers: ['A', 'B'], currentIndex: 2 }, storage, now);
    expect(getQuizDraft(now + 1000, storage)).toEqual({
      version: 1,
      answers: ['A', 'B'],
      currentIndex: 2,
      updatedAt: now
    });
  });

  it('expires old quiz drafts and removes broken cache values', () => {
    saveQuizDraft({ answers: ['A'], currentIndex: 1 }, storage, now);
    expect(getQuizDraft(now + 24 * 60 * 60 * 1000 + 1, storage)).toBeNull();
    storage.setItem(DRAFT_KEY, '{bad json');
    expect(getQuizDraft(now, storage)).toBeNull();
    expect(storage.getItem(DRAFT_KEY)).toBeNull();
  });

  it('keeps latest result cache separate from draft cache', () => {
    const answers = Array.from({ length: 16 }, () => 'B') as AnswerOption[];
    const result = computePersonality(answers, new Date(now));
    saveQuizDraft({ answers: ['A'], currentIndex: 1 }, storage, now);
    saveLatestLocalResult(result, storage);
    clearQuizDraft(storage);

    expect(getQuizDraft(now, storage)).toBeNull();
    expect(getLatestLocalResult(storage)?.personality_code).toBe(result.personality_code);

    clearLatestLocalResult(storage);
    expect(getLatestLocalResult(storage)).toBeNull();
  });
});
