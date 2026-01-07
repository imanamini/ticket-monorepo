const levels: { pow: number; label: string }[] = [
  { pow: 9, label: ' میلیارد' },
  { pow: 6, label: ' میلیون' },
  { pow: 3, label: ' هزار' },
];

const tenPow = (pow: number): number => Math.pow(10, pow);
const separator = ' و ';

export const numberToString = (input: number): string => {
  if (input === 0) return '0';

  let output = '';
  let remaining = input;

  levels.forEach((level) => {
    const unitValue = Math.floor(remaining / tenPow(level.pow));
    if (unitValue > 0) {
      output += (output ? separator : '') + unitValue.toLocaleString() + level.label;
      remaining = remaining % tenPow(level.pow);
    }
  });

  if (remaining > 0) {
    output += (output ? separator : '') + remaining.toLocaleString();
  }

  return output;
};
