export enum DrawStatus {
  ALLOCATE = 0,
  WIN = 1,
  LOSE = 2,
}

export const DRAW_STATUS_TRANSLATION = {
  [DrawStatus.ALLOCATE]: 'هنوز برگزار نشده',
  [DrawStatus.WIN]: 'برنده شده‌اید',
  [DrawStatus.LOSE]: 'برنده نشده‌اید',
};
