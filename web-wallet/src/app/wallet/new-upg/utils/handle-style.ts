export class HandleStyle {

  public animate(element: HTMLElement): void {
    element.classList.add('shake');
    setTimeout(() => {
      element.classList.remove('shake');
    }, 500);
  }
}
