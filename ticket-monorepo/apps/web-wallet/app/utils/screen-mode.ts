export class ScreenMode {
  constructor() {
  }

  public get(): 'DESKTOP' | 'MOBILE' {
    if (window.matchMedia('(max-width: 813px)').matches) {
      return 'MOBILE';
    }
    return 'DESKTOP';
  }
}
