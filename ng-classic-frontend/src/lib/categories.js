export const CATEGORIES = [
  { value: 'Wigs',              label: 'Wigs' },
  { value: 'Bundles',           label: 'Bundles' },
  { value: 'Closures_Frontals', label: 'Closures & Frontals' },
  { value: 'Hair_Care',         label: 'Hair Care' },
];

export function getCategoryLabel(value) {
  return CATEGORIES.find(c => c.value === value)?.label ?? value;
}
