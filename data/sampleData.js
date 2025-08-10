import { emotions, emotionKeys } from '../utils/constants/index.js';

// simple deterministic PRNG so server and client generate the same data
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(1);

const CAPITALS = [
  { country: 'France', city: 'Paris', lat: 48.8566, lng: 2.3522 },
  { country: 'USA', city: 'New York', lat: 40.7128, lng: -74.006 },
  { country: 'Brazil', city: 'São Paulo', lat: -23.5558, lng: -46.6396 },
  { country: 'Japan', city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { country: 'Australia', city: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { country: 'Canada', city: 'Toronto', lat: 43.6532, lng: -79.3832 },
  { country: 'India', city: 'Delhi', lat: 28.6139, lng: 77.209 },
  { country: 'South Africa', city: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
  { country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { country: 'Mexico', city: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  { country: 'China', city: 'Beijing', lat: 39.9042, lng: 116.4074 },
  { country: 'UK', city: 'London', lat: 51.5074, lng: -0.1278 },
  { country: 'Germany', city: 'Berlin', lat: 52.52, lng: 13.405 },
  { country: 'Italy', city: 'Rome', lat: 41.9028, lng: 12.4964 },
  { country: 'Spain', city: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { country: 'Argentina', city: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },
  { country: 'Egypt', city: 'Cairo', lat: 30.0444, lng: 31.2357 },
  { country: 'Turkey', city: 'Istanbul', lat: 41.0082, lng: 28.9784 },
  { country: 'Nigeria', city: 'Lagos', lat: 6.5244, lng: 3.3792 },
  { country: 'Indonesia', city: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { country: 'Philippines', city: 'Manila', lat: 14.5995, lng: 120.9842 },
  { country: 'Pakistan', city: 'Karachi', lat: 24.8607, lng: 67.0011 },
  { country: 'Bangladesh', city: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  { country: 'Saudi Arabia', city: 'Riyadh', lat: 24.7136, lng: 46.6753 },
  { country: 'UAE', city: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { country: 'Colombia', city: 'Bogotá', lat: 4.711, lng: -74.0721 },
  { country: 'South Korea', city: 'Seoul', lat: 37.5665, lng: 126.978 },
  { country: 'Ukraine', city: 'Kyiv', lat: 50.4501, lng: 30.5234 },
  { country: 'Gaza', city: 'Gaza City', lat: 31.522, lng: 34.451 },
];

function jitter(lat, lng) {
  const d = rand() * 1.2 + 0.1;
  return {
    lat: lat + (rand() - 0.5) * d,
    lng: lng + (rand() - 0.5) * d,
  };
}

function randomEmotion() {
  const idx = Math.floor(rand() * emotionKeys.length);
  return emotionKeys[idx];
}

function generateData() {
  const features = [];
  let id = 1;
  let videos = 500;
  let lives = 200;
  while (videos + lives > 0) {
    const c = CAPITALS[Math.floor(rand() * CAPITALS.length)];
    const { lat, lng } = jitter(c.lat, c.lng);
    const type = rand() < videos / (videos + lives) ? 'video' : 'live';
    if (type === 'video') videos--; else lives--;
    const emotion = randomEmotion();
    features.push({
      id: id++,
      title: `${emotions[emotion].label} ${id}`,
      country: c.country,
      type,
      emotion,
      coordinates: [lng, lat],
    });
  }
  return features;
}

export const sampleData = generateData();
