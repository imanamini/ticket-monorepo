export type HeaderState = 'compact' | 'full';
export type Platform = 'android' | 'ios';
export type HeaderChangeState = 'expand' | 'hide' | 'compact';
export type NavigationTabState = { height: number, variant: HeaderState };

interface SuperAppApi {
  /**
   * Get the current version of SuperApp
   * @returns The current version as a number
   */
  getSuperAppVersion(): number;

  /**
   * Retrieve the current saToken
   * @returns null or the token string
   */
  getSuperAppToken(): string | null;


  getSuperAppTokenAsync(): Promise<string | null>;

  /**
   * Get the threshold value of headerCollapse
   * @returns The threshold value as a number
   */
  getScrollThreshold(): number;

  /**
   * Change the header state in HomePage
   * @param state - "compact" or "full"
   */
  setHeaderState(state: HeaderState): void;

  /**
   * Retrieve the current version of the app
   * @returns The app version as a string (e.g., "2.11.0")
   */
  getAppVersion(): string;

  /**
   * Access the user’s platform information
   * @returns 'android' or 'ios'
   */
  getPlatform(): Platform;

  /**
   * Obtain the user’s platform version
   * @returns The platform version as a number (e.g., 13)
   */
  getPlatformVersion(): number;

  /**
   * Fetch the app’s build number
   * @returns The build number as a number (e.g., 107)
   */
  getBuildNumber(): number;

  /**
   * Navigate to the login page in SuperApp and return to the last visited page
   * After this action, you can invoke getSuperAppToken to get the saToken
   */
  login(): void;

  /**
   * Logout from all of the services in SuperApp
   */
  logout(): void;

  /**
   * Show a Toast message inside the application
   * @param content - The message to display
   * @param duration - Duration in milliseconds
   */
  toast(content: string, duration: number): void;

  /**
   * On iOS and Android platforms, prompt the user for FINE_LOCATION (precise) permission
   * @param cbFn - Callback function with granted boolean
   */
  requestLocationPermission(cbFn: (granted: boolean) => void): void;

  /**
   * Persist localStorageData on iOS devices. For Android, WebView manages data storage and access directly from LocalStorage.
   * @param localStorageData - The data to persist
   */
  persistLocalStorageOnIOS(localStorageData: string): void;

  /**
   * Retrieve stored localStorage data on iOS devices
   * @returns The stored data as a string or null
   */
  getPersistedLocalStorageOnIOS(): string | null;

  /**
   * Persist localStorageData on devices
   * @param localStorageData - The data to persist
   */
  persistLocalStorage(localStorageData: string): void;

  /**
   * Retrieve stored localStorage data on devices (async)
   * @returns A promise resolving to the stored data as a string or null
   */
  getPersistedLocalStorage(): Promise<string | null>;

  /**
   * Modify PullToRefresh behavior by passing a boolean value
   * The last set value persists until altered again
   * @param isActive - Whether PullToRefresh is active
   */
  setPullToRefreshState(isActive: boolean): void;

  /**
   * Control the behavior of onBackPress in the mini-app header
   * The last set value persists until altered again
   * @param cbFn - Callback function to handle back press
   */
  onBackHandler(cbFn: () => void): void;

  /**
   * Fires callback function when users click on superapp tabular when the tab is focused
   * The last set value persists until altered again
   * @param cbFn - Callback function to handle home pressed
   */
  onHomePressed(cbFn: () => void): void;

  /**
   * Seamlessly manifests your logs on the native side
   * @param log - The log message
   */
  logger(log: string): void;

  /**
   * Opens a url in the default browser of the user
   * @param url - The URL to open
   */
  openExternalLink(url: string): void;

  openLink(url: string): void;

  /**
   * Opens another webview instance on native app
   * @param url - The URL to open
   * @param title - The title for the new webview
   */
  gotoWebViewAction(url: string, title: string): void;

  /**
   * Fires callback function when superapp tabular state changes
   * The last set value persists until altered again
   * @param cbFn - Callback function with state: expand | hide | compact
   */
  setHeaderChangeStateCallback(cbFn: (state: HeaderChangeState) => void): void;
}

export interface DigikalaAppWindow extends Window {
  SuperAppApi: SuperAppApi;
}
