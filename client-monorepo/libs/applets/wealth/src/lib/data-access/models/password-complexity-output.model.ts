export interface PasswordComplexityOutput {
  value: string;
  complexity: number;
  rules: [key: string, value: boolean][];
}
