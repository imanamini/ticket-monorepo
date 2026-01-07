export interface ValueLimiter {
  minValue(): number | undefined;
  maxValue(): number | undefined;
}
