import { signal, WritableSignal } from '@angular/core';

export class SetOfObjects<T> {
  private items: WritableSignal<T[]> = signal([]);
  private getKey: (item: T) => string;

  constructor(getKey: (item: T) => string) {
    this.getKey = getKey;
  }

  add(item: T): boolean {
    if (!this.has(item)) {
      const tempItems = this.items();
      tempItems.push(item);
      this.items.set(tempItems);
      return true;
    }
    return false;
  }

  delete(item: T): boolean {
    if (this.has(item)) {
      this.items.update(() => {
        return this.items().filter((existing) => this.getKey(existing) !== this.getKey(item));
      });
      return true;
    }
    return false;
  }

  has(item: T): boolean {
    return this.items().some((existing) => this.getKey(existing) === this.getKey(item));
  }

  get(item: T): T | undefined {
    return this.items().find((existing) => this.getKey(existing) === this.getKey(item));
  }
  set(items: T[]): void {
    this.clear();
    items.forEach((item) => {
      this.add(item);
    });
  }

  values(): T[] {
    return [...this.items()];
  }

  clear(): void {
    this.items.set([]);
  }
}
