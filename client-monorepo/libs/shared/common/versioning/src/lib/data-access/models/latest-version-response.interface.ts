export interface VersionResponse {
  latest: boolean;
  latestVersion: string;
  forceUpdate: boolean;
  storeUrl: string;
  changelogUrl: string;
  channels: Array<string>;
}
