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
  { label: "영유아", sub: "0~6세" },
  { label: "어린이", sub: "7~12세" },
  { label: "청소년", sub: "13~19세" },
  { label: "청년", sub: "20~39세" },
  { label: "중년", sub: "40~49세" },
  { label: "장년", sub: "50세~" }
];

// 나이 그룹 라벨 매핑 (최적화: 매번 문자열 비교 대신 맵 사용)
export const AGE_GROUP_LABELS = {
  '영유아': '영유아(~6세)',
  '어린이': '어린이(7세~12세)',
  '청소년': '청소년(13세~19세)',
  '청년': '청년(20세~39세)',
  '중년': '중년(40세~49세)',
  '장년': '장년(50세~)'
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
