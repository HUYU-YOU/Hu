export interface HuFlag {
  id: string;
  type: 'country' | 'cause';
  label: { fr: string; en: string };
  icon: string; // path to svg in /public
}

export const metaFlags: HuFlag[] = [
  { id: 'FR', type: 'country', label: { fr: 'France', en: 'France' }, icon: '/flags/FR.svg' },
  { id: 'pride', type: 'cause', label: { fr: 'LGBTQIA+', en: 'LGBTQIA+' }, icon: '/flags/pride.svg' },
  { id: 'climate', type: 'cause', label: { fr: 'Climat', en: 'Climate' }, icon: '/flags/climate.svg' },
];

export function getFlag(id: string): HuFlag | undefined {
  return metaFlags.find(f => f.id === id);
}
