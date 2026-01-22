export const convertToGroup = (age) => {
  const kAge = age + 4;
  if (kAge <= 6) return "영유아";
  if (kAge <= 12) return "어린이";
  if (kAge <= 19) return "청소년";
  if (kAge <= 39) return "청년";
  if (kAge <= 49) return "중년";
  return "장년";
};
