import { delay, of } from 'rxjs';

export const runHeightAnimation = (element: HTMLElement): void => {
  element.style.height = null;
  const oldBodyHeight = element.offsetHeight;
  of('')
    .pipe(delay(5))
    .subscribe({
      next: () => {
        const newBodyHeight = element.clientHeight;
        const bodyTransition = element.style.transition;
        element.style.transition = '';
        requestAnimationFrame(function () {
          element.style.height = oldBodyHeight + 'px';
          element.style.transition = bodyTransition;
          requestAnimationFrame(function () {
            element.style.height = newBodyHeight + 'px';
          });
        });
      },
    });
};
