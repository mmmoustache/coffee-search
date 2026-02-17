export const themes = {
  '100001': {
    backgroundColor: 'bg-100001',
    textColor: 'text-100001',
  },
  '100002': {
    backgroundColor: 'bg-100002',
    textColor: 'text-100002',
  },
  '100003': {
    backgroundColor: 'bg-100003',
    textColor: 'text-100003',
  },
  '100004': {
    backgroundColor: 'bg-100004',
    textColor: 'text-100004',
  },
  '100005': {
    backgroundColor: 'bg-100005',
    textColor: 'text-100005',
  },
  '100006': {
    backgroundColor: 'bg-100006',
    textColor: 'text-100006',
  },
  '100007': {
    backgroundColor: 'bg-100007',
    textColor: 'text-100007',
  },
  '100008': {
    backgroundColor: 'bg-100008',
    textColor: 'text-100008',
  },
  '100009': {
    backgroundColor: 'bg-100009',
    textColor: 'text-100009',
  },
  '100010': {
    backgroundColor: 'bg-100010',
    textColor: 'text-100010',
  },
} as const;

export type ThemeSku = keyof typeof themes;
export type Theme = (typeof themes)[ThemeSku];

export function isThemeSku(value: string): value is ThemeSku {
  return value in themes;
}

export function getTheme(sku: string | number): Theme | undefined {
  const key = String(sku);
  if (!isThemeSku(key)) return undefined;
  return themes[key];
}
