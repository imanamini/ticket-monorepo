import { DirectDebitCardInterface } from '../interfaces/direct-debit-card-interface';

export class DirectDebitCardModel {
  public card: DirectDebitCardInterface = {
    title: '',
    iconPath: '',
    description: {
      text: '',
      style: {
        color: '#2c3544', 'font-size': ''
      }
    }
  };
}
