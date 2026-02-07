export const convertToGroup = (age, correction = 4) => {
  const kAge = age + correction;
  if (kAge <= 6) return "toddler";     // 0~6세
  if (kAge <= 12) return "child";      // 7~12세
  if (kAge <= 19) return "teen";       // 13~19세
  if (kAge <= 39) return "youth";      // 20~39세
  if (kAge <= 64) return "middleAge";  // 40~64세
  return "senior";                      // 65세 이상
};
