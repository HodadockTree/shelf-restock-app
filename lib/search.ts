const HANGUL_BASE_CODE = "\uAC00".charCodeAt(0);
const HANGUL_END_CODE = "\uD7A3".charCodeAt(0);
const HANGUL_SYLLABLE_COUNT = 28 * 21;

const INITIAL_CONSONANTS = [
  "\u3131",
  "\u3132",
  "\u3134",
  "\u3137",
  "\u3138",
  "\u3139",
  "\u3141",
  "\u3142",
  "\u3143",
  "\u3145",
  "\u3146",
  "\u3147",
  "\u3148",
  "\u3149",
  "\u314A",
  "\u314B",
  "\u314C",
  "\u314D",
  "\u314E",
] as const;

export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

export function getInitialConsonants(text: string): string {
  return normalizeSearchText(text)
    .split("")
    .map((character) => {
      const code = character.charCodeAt(0);

      if (code < HANGUL_BASE_CODE || code > HANGUL_END_CODE) {
        return character;
      }

      const initialIndex = Math.floor(
        (code - HANGUL_BASE_CODE) / HANGUL_SYLLABLE_COUNT
      );

      return INITIAL_CONSONANTS[initialIndex] ?? character;
    })
    .join("");
}

export function matchesSearchKeyword(
  target: string,
  keyword: string
): boolean {
  const normalizedKeyword = normalizeSearchText(keyword);

  if (!normalizedKeyword) {
    return true;
  }

  const normalizedTarget = normalizeSearchText(target);

  if (normalizedTarget.includes(normalizedKeyword)) {
    return true;
  }

  return getInitialConsonants(target).includes(
    getInitialConsonants(keyword)
  );
}
