/**
 * 고유한 ID를 생성합니다.
 * @returns {string} 고유 ID (timestamp_randomstring 형식)
 */
export const generateUniqueId = () => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};
