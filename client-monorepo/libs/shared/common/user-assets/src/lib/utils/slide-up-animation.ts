export interface SlideAnimationConfig {
  cardHeight: number; // 72px
  totalItems: number; // 2 items
  overshootRatio: number; // 0.1
  pauseDurationSeconds: number; // 2 seconds
  moveDurationSeconds: number; // 1.5 seconds
  overshootPercentage: number; // 0.5
}

/**
 * Generates a dynamic @keyframes CSS string and total duration
 * for a smooth looping vertical promotion animation.
 *
 * @param config - animation configuration values
 * @param keyframesName - name of the animation keyframes
 * @returns object with keyframes text and duration (in seconds)
 */
export function generateSlideAnimation(config: SlideAnimationConfig, keyframesName = 'slide-up'): { keyframes: string; duration: number } {
  const { cardHeight, totalItems, overshootRatio, pauseDurationSeconds, moveDurationSeconds, overshootPercentage } = config;

  if (totalItems <= 0) {
    throw new Error('totalItems must be greater than 0');
  }

  // Derived values
  const overshoot = cardHeight * overshootRatio;
  const pauseRatio = pauseDurationSeconds / (pauseDurationSeconds + moveDurationSeconds);
  const moveRatio = moveDurationSeconds / (pauseDurationSeconds + moveDurationSeconds);
  const step = 100 / totalItems;
  const duration = (pauseDurationSeconds + moveDurationSeconds) * totalItems;
  const endPos = -cardHeight * totalItems;

  // Start building keyframes
  let keyframes = `@keyframes ${keyframesName} {`;

  for (let i = 0; i < totalItems; i++) {
    const startPercent = i * step;
    const pauseEnd = startPercent + step * pauseRatio;
    const moveEnd = startPercent + step;
    const pos = -cardHeight * i;
    const nextPos = -cardHeight * (i + 1);
    const overshootPos = nextPos - overshoot;

    keyframes += `
      ${startPercent}% {
        transform: translateY(${pos}px);
        animation-timing-function: ease-in;
      }
      ${pauseEnd}% {
        transform: translateY(${pos}px);
        animation-timing-function: ease-in;
      }
      ${pauseEnd + step * moveRatio * overshootPercentage}% {
        transform: translateY(${overshootPos}px);
        animation-timing-function: ease-out;
      }
      ${moveEnd}% {
        transform: translateY(${nextPos}px);
        animation-timing-function: ease-in;
      }
    `;
  }

  // End keyframe (seamless loop)
  keyframes += `
    100% {
      transform: translateY(${endPos}px);
    }
  }`;

  return { keyframes, duration };
}
