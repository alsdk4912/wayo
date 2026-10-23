export type Lang = "ko" | "en";

const CACHE_KEY = "wayo_translation_cache";

export function textLang(text: string): Lang {
  return /[가-힣]/.test(text) ? "ko" : "en";
}

function cacheKey(text: string, target: Lang) {
  return `${target}:${text}`;
}

function readCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed as Record<string, string> : {};
  } catch {
    return {};
  }
}

export async function translateText(text: string, target: Lang): Promise<string> {
  const source = textLang(text);
  if (source === target) return text;
  const cached = readCache()[cacheKey(text, target)];
  if (cached) return cached;

  const query = text.trim().slice(0, 450);
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=${source}|${target}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("번역 요청에 실패했습니다.");
  const data = await response.json() as { responseData?: { translatedText?: string } };
  const translated = data.responseData?.translatedText?.trim() ?? "";
  if (!translated || /MYMEMORY WARNING|QUERY LENGTH|INVALID LANGUAGE/i.test(translated)) {
    throw new Error("번역 결과를 받지 못했습니다.");
  }
  const cache = readCache();
  cache[cacheKey(text, target)] = translated;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  return translated;
}
