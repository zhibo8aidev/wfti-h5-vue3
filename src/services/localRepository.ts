import type { PersonalityResult, QuizDraft } from '@/domains/types';

export const DRAFT_KEY = 'wfti_quiz_draft_v1';
export const LATEST_RESULT_KEY = 'wfti_latest_result_v1';
export const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function getStorage(storage?: StorageLike): StorageLike | null {
  if (storage) return storage;
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function readJson<T>(key: string, storage?: StorageLike): T | null {
  const store = getStorage(storage);
  if (!store) return null;
  try {
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    store.removeItem(key);
    return null;
  }
}

function writeJson(key: string, value: unknown, storage?: StorageLike): void {
  const store = getStorage(storage);
  if (!store) return;
  store.setItem(key, JSON.stringify(value));
}

export function getQuizDraft(now = Date.now(), storage?: StorageLike): QuizDraft | null {
  const draft = readJson<QuizDraft>(DRAFT_KEY, storage);
  if (!draft || draft.version !== 1 || !Array.isArray(draft.answers)) {
    clearQuizDraft(storage);
    return null;
  }
  if (now - draft.updatedAt > DRAFT_TTL_MS) {
    clearQuizDraft(storage);
    return null;
  }
  return draft;
}

export function saveQuizDraft(draft: Omit<QuizDraft, 'version' | 'updatedAt'>, storage?: StorageLike, now = Date.now()): void {
  writeJson(
    DRAFT_KEY,
    {
      version: 1,
      answers: draft.answers,
      currentIndex: draft.currentIndex,
      updatedAt: now
    } satisfies QuizDraft,
    storage
  );
}

export function clearQuizDraft(storage?: StorageLike): void {
  getStorage(storage)?.removeItem(DRAFT_KEY);
}

export function getLatestLocalResult(storage?: StorageLike): PersonalityResult | null {
  const result = readJson<PersonalityResult>(LATEST_RESULT_KEY, storage);
  if (!result?.personality_code || !Array.isArray(result.answers)) {
    if (result) clearLatestLocalResult(storage);
    return null;
  }
  return result;
}

export function saveLatestLocalResult(result: PersonalityResult, storage?: StorageLike): void {
  writeJson(LATEST_RESULT_KEY, result, storage);
}

export function clearLatestLocalResult(storage?: StorageLike): void {
  getStorage(storage)?.removeItem(LATEST_RESULT_KEY);
}
