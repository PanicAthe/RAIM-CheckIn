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

// 기본 연령대 (ID 기반, 번역은 i18n에서 처리)
export const DEFAULT_AGE_GROUPS = [
  { id: 'toddler' },
  { id: 'child' },
  { id: 'teen' },
  { id: 'youth' },
  { id: 'middleAge' },
  { id: 'senior' }
];

// 연령대 ID → 한국어 레이블 매핑 (DB 저장용 - 범위 포함)
export const AGE_GROUP_ID_TO_LABEL = {
  'toddler': '유아(0~6세)',
  'child': '어린이(7~12세)',
  'teen': '청소년(13~19세)',
  'youth': '청년(20~39세)',
  'middleAge': '중년(40~64세)',
  'senior': '노년(65세 이상)'
};

// 연령대 ID → 한국어 레이블 매핑 (UI용 - 범위 제외)
export const AGE_GROUP_ID_TO_LABEL_SIMPLE = {
  'toddler': '유아',
  'child': '어린이',
  'teen': '청소년',
  'youth': '청년',
  'middleAge': '중년',
  'senior': '노년'
};

// 한국어 레이블 → 연령대 ID 매핑 (범위 포함 버전만)
export const AGE_GROUP_LABEL_TO_ID = {
  '유아(0~6세)': 'toddler',
  '어린이(7~12세)': 'child',
  '청소년(13~19세)': 'teen',
  '청년(20~39세)': 'youth',
  '중년(40~64세)': 'middleAge',
  '노년(65세 이상)': 'senior'
};

// 캐시 키 상수
export const ROOM_CACHE_KEY = 'room_locations_cache';

// 성별/출처 매핑 (DB 저장용 → 한국어 표시용)
export const GENDER_MAP = {
  'male': '남성',
  'female': '여성'
};

export const SOURCE_MAP = {
  'Manual': '수동',
  'AI': 'AI'
};

// 공통 유틸 함수들 (여러 컴포넌트에서 사용)
export const normalizeAgeGroupId = (value) => AGE_GROUP_LABEL_TO_ID[value] || value;

export const getAgeGroupLabel = (value) => {
  const normalized = normalizeAgeGroupId(value);
  // UI용: 범위 제외 버전 표시
  return AGE_GROUP_ID_TO_LABEL_SIMPLE[normalized] || value;
};

