export const ColorsByPropType = { 
  '01': '#6fa3f6',
  '02': '#9d85f5',
  '03': '#ef95b6',
  '04': '#f0c842',
  '05': '#f4ab67',
  '06': '#92959f',
  '07': '#b1a476',
} as Record<string, string>;

export function getPropTypeColor(type:string) {
  return ColorsByPropType[type] || 'lightgray';
}