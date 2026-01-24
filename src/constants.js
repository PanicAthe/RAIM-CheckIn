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
