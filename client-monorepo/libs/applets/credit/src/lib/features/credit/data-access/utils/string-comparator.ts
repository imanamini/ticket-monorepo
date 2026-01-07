export const areStringsSimilar = (str1: string, str2: string, percentage: number): boolean => {
  if (!str1 && !str2) return true;
  if (!str1 || !str2) return false;

  str1 = str1.toLowerCase().trim();
  str2 = str2.toLowerCase().trim();

  const len1 = str1.length;
  const len2 = str2.length;
  const maxLen = Math.max(len1, len2);

  if (maxLen === 0) return true;

  const allowedDistance = Math.floor(maxLen * (1 - percentage / 100));
  if (Math.abs(len1 - len2) > allowedDistance) return false;

  let prev = Array(len2 + 1).fill(0);
  let curr = Array(len2 + 1).fill(0);

  for (let j = 0; j <= len2; j++) prev[j] = j;

  for (let i = 1; i <= len1; i++) {
    curr[0] = i;
    let minInRow = curr[0];

    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      minInRow = Math.min(minInRow, curr[j]);
    }

    if (minInRow > allowedDistance) return false;
    [prev, curr] = [curr, prev];
  }

  const distance = prev[len2];
  const similarity = ((maxLen - distance) / maxLen) * 100;

  return similarity >= percentage;
};
