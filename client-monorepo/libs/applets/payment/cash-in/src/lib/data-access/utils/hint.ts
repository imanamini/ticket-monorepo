export class Hint {
  public getState(): boolean | undefined {
    return localStorage.getItem('cashInHintWasRead') === 'true' ? true : undefined;
  }

  public setState() {
    localStorage.setItem('cashInHintWasRead', 'true');
  }
}
