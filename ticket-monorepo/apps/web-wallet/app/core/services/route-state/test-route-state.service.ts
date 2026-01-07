import { RouteStateInterface } from './route-state.interface';

export class TestRouteStateService implements RouteStateInterface {

  data = {};

  /**
   * USEFUL FOR MOCKING THE ROUTE STATE WHILE TESTING
   * @param data
   */
  set(data: object) {
    this.data = data;
    return this;
  }

  get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.has(key)) {
        reject();
      }

      resolve(this.getAll()[key]);
    });
  }

  getAll(): any {
    return this.data;
  }

  has(key: string): boolean {
    return this.data.hasOwnProperty(key);
  }

}
