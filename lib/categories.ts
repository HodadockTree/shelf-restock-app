export const CATEGORIES = ["음료", "과자", "라면", "유제품", "아이스크림", "생활용품", "기타"] as const;

export type Category = (typeof CATEGORIES)[number];
