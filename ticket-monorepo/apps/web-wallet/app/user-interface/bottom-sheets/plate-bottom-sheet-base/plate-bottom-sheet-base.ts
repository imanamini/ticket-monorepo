export class PlateBottomSheetBase {

  showKeyboard = false;

  constructor() {
    this.globalClickListener = this.globalClickListener.bind(this);
  }

  protected hideKeyboard(): void {
    this.showKeyboard = false;
    this.removeOutsideListener();
  }

  protected removeOutsideListener(): void {
    window.removeEventListener('click', this.globalClickListener);
  }

  protected setOutsideListener(): void {
    window.addEventListener('click', this.globalClickListener);
  }

  protected globalClickListener(event): void {
    if (!this.showKeyboard) {
      return;
    }
    const element = document.querySelector('.letter-keyboard-block') as HTMLElement;
    if (!element.contains(event.target) && element !== event.target) {
      this.hideKeyboard();
    }
  }

  onLetterClick(): void {
    this.showKeyboard = !this.showKeyboard;
    setTimeout(() => {
      if (this.showKeyboard) {
        // visible
        this.setOutsideListener();
      } else {
        this.removeOutsideListener();
      }
    });
  }
}
