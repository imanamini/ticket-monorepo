export function convertSearchParamsToJson(params: string): string {
  const parsedData = Object.fromEntries(new URLSearchParams(params));
  return JSON.stringify(parsedData, null, 2);
}
