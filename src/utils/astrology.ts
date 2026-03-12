/**
 * Tamil Astrology - 10 Poruthams Calculation Logic
 * This is a simplified version based on Nakshatra (Star) indices.
 */

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krithika", "Rohini", "Mrigashira", "Arudra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Poorva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Moola", "Poorvashada", "Uttarashada", "Shravana", "Dhanishta", "Shatabhisha", "Poorvabhadra", "Uttarabhadra", "Revati"
];

export const RASIS = [
  "Mesham", "Rishabam", "Midhunam", "Kadagam", "Simmam", "Kanni", "Thulaam", "Viruchigam", "Dhanusu", "Magaram", "Kumbam", "Meenam"
];

export interface MatchResult {
  score: number;
  total: number;
  percentage: number;
  poruthams: { [key: string]: boolean };
  indicator: 'Green' | 'Red';
}

export function calculateMatch(brideStar: string, groomStar: string): MatchResult {
  const bIdx = NAKSHATRAS.indexOf(brideStar);
  const gIdx = NAKSHATRAS.indexOf(groomStar);

  if (bIdx === -1 || gIdx === -1) {
    return { score: 0, total: 10, percentage: 0, poruthams: {}, indicator: 'Red' };
  }

  const poruthams: { [key: string]: boolean } = {
    "Dina": false,
    "Gana": false,
    "Mahendra": false,
    "Sthree Deergha": false,
    "Yoni": false,
    "Rasi": false,
    "Rasi Athipathi": false,
    "Vasya": false,
    "Rajju": false,
    "Vedha": false
  };

  // 1. Dina Porutham (Health and Prosperity)
  // Rule: Count from bride's star to groom's star. Divide by 9. Remainder 2, 4, 6, 8, 9 are good.
  const dinaDist = ((gIdx - bIdx + 27) % 27) + 1;
  const dinaRem = dinaDist % 9;
  if ([2, 4, 6, 8, 0].includes(dinaRem)) poruthams["Dina"] = true;

  // 2. Gana Porutham (Temperament)
  // Simplified: Deva, Manusha, Rakshasa
  const getGana = (idx: number) => {
    const devas = [0, 3, 4, 7, 12, 14, 16, 21, 26];
    const manushas = [1, 2, 10, 11, 13, 19, 20, 24, 25];
    if (devas.includes(idx)) return 'Deva';
    if (manushas.includes(idx)) return 'Manusha';
    return 'Rakshasa';
  };
  const bGana = getGana(bIdx);
  const gGana = getGana(gIdx);
  if (bGana === gGana) poruthams["Gana"] = true;
  else if (bGana === 'Deva' && gGana === 'Manusha') poruthams["Gana"] = true;
  else if (bGana === 'Manusha' && gGana === 'Deva') poruthams["Gana"] = true;

  // 3. Mahendra Porutham (Wealth and Children)
  // Rule: Count from bride to groom. 4, 7, 10, 13, 16, 19, 22, 25 are good.
  const mDist = ((gIdx - bIdx + 27) % 27) + 1;
  if ([4, 7, 10, 13, 16, 19, 22, 25].includes(mDist)) poruthams["Mahendra"] = true;

  // 4. Sthree Deergha (Longevity for bride)
  // Rule: Groom's star should be more than 13 stars away from bride's star.
  if (mDist > 13) poruthams["Sthree Deergha"] = true;

  // 5. Yoni Porutham (Physical compatibility)
  // Simplified: Based on animal symbols (not fully implemented here, using a random-ish but deterministic logic for demo)
  if ((bIdx + gIdx) % 2 === 0) poruthams["Yoni"] = true;

  // 6. Rasi Porutham (Unity)
  // Rule: Count from bride's Rasi to groom's Rasi.
  const bRasi = Math.floor(bIdx / 2.25);
  const gRasi = Math.floor(gIdx / 2.25);
  const rasiDist = ((gRasi - bRasi + 12) % 12) + 1;
  if ([1, 7, 12].includes(rasiDist) || rasiDist > 6) poruthams["Rasi"] = true;

  // 7. Rasi Athipathi (Friendship of lords)
  if ((bRasi + gRasi) % 3 !== 0) poruthams["Rasi Athipathi"] = true;

  // 8. Vasya Porutham (Mutual attraction)
  if (Math.abs(bRasi - gRasi) <= 5) poruthams["Vasya"] = true;

  // 9. Rajju Porutham (Duration of married life) - MOST IMPORTANT
  // Rule: Stars are divided into 5 Rajjus (Head, Neck, Stomach, Thigh, Foot). Must not be same.
  const getRajju = (idx: number) => {
    const groups = [
      [0, 8, 9, 17, 18, 26], // Foot
      [1, 7, 10, 16, 19, 25], // Thigh
      [2, 6, 11, 15, 20, 24], // Stomach
      [3, 5, 12, 14, 21, 23], // Neck
      [4, 13, 22] // Head
    ];
    return groups.findIndex(g => g.includes(idx));
  };
  if (getRajju(bIdx) !== getRajju(gIdx)) poruthams["Rajju"] = true;

  // 10. Vedha Porutham (Affliction)
  // Rule: Certain stars are mutually repellent.
  const vedhaPairs = [[0,17], [1,16], [2,15], [3,14], [5,12], [6,11], [7,10], [8,9], [18,26], [19,25], [20,24], [21,23]];
  const isVedha = vedhaPairs.some(p => (p[0] === bIdx && p[1] === gIdx) || (p[0] === gIdx && p[1] === bIdx));
  if (!isVedha) poruthams["Vedha"] = true;

  const score = Object.values(poruthams).filter(v => v).length;
  const total = 10;
  const percentage = (score / total) * 100;
  const indicator = percentage >= 60 ? 'Green' : 'Red';

  return { score, total, percentage, poruthams, indicator };
}
