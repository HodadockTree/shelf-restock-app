export const CATEGORIES = [ "과자", "라면"] as const;

export type Category = (typeof CATEGORIES)[number];
