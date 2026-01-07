/**
 * Any class that provides the state data should implement this interface,
 * If you want override the default one (route-state.service) you should
 * provide the new implementation in the module's `providers` array.
 *
 * There is two implementation by now and I Think it will be enough.
 * (...So be careful about what you are doing)
 */
export interface CreditRouteStateInterface {
  /**
   * Check if state has a value for the given key
   * @param key
   */
  has(key: string): boolean;

  /**
   * Should return all state data
   */
  getAll(): any;

  /**
   * Gets a value using it's key
   * Returns a promise and rejects it when key does not exists
   *
   * @param key
   */
  get(key: string): Promise<any>;
}
