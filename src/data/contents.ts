import { ContentItem } from '@/context/AppContext';

export const contents: ContentItem[] = [
  {
    id: '1',
    type: 'video',
    title: 'Sourires de Paris',
    emotion: 'jaune',
    country: 'France',
    coords: { lat: 48.8566, lng: 2.3522 },
  },
  {
    id: '2',
    type: 'live',
    title: 'Concert à Madrid',
    emotion: 'orange',
    country: 'Espagne',
    coords: { lat: 40.4168, lng: -3.7038 },
  },
  {
    id: '3',
    type: 'video',
    title: 'Forêt amazonienne',
    emotion: 'vert',
    country: 'Brésil',
    coords: { lat: -3.4653, lng: -62.2159 },
  },
];
