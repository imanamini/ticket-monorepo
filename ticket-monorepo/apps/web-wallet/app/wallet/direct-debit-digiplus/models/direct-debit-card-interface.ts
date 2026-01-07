export interface DirectDebitCardInterface {
  title: string;
  iconPath: string;
  description: {
    text: string;
    style?:
      {
        color: string;
        'font-size': string
      }
  };
}
