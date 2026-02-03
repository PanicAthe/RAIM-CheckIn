export const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || "0000";

export const RAIM_COLORS = {
  TEAL: '#1FBDC6', 
  SKY: '#00BFDF', 
  MUTED: '#508EBC', 
  MEDIUM: '#276FB7',
  DARK: '#00448B', 
  BLACK: '#000000', 
  BG: '#F0F4F8', 
  DANGER: '#EF4444',
  GRAY_BG: '#F3F4F6', 
  GRAY_TXT: '#374151'
};

export const ageGroups = [
  { label: "유아", sub: "0~6세", key: "infant" },
  { label: "어린이", sub: "7~12세", key: "child" },
  { label: "청소년", sub: "13~19세", key: "teen" },
  { label: "청년", sub: "20~39세", key: "youth" },
  { label: "중년", sub: "40~64세", key: "middleAge" },
  { label: "노년", sub: "65세 이상", key: "senior" }
];

export const AGE_GROUP_LABELS = {
  '유아': '유아(0~6세)',
  '어린이': '어린이(7~12세)',
  '청소년': '청소년(13~19세)',
  '청년': '청년(20~39세)',
  '중년': '중년(40~64세)',
  '노년': '노년(65세 이상)',
  '영유아': '유아(0~6세)',
  '장년': '노년(65세 이상)'
};

export const roomLocations = [
  "상설전시",
  "기획전시",
  "사일런트 도슨트",
  "전시연계",
  "다목적실-1",
  "다목적실-2",
  "다목적실-3"
];
