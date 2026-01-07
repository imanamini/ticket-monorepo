export class Card {
  protected implementPrefixCard(cardNumber: string): string {
    return cardNumber.substr(0, 6);
  }

  protected implementPostfixCard(cardNumber: string): string {
    return cardNumber.substr(12, 4);
  }
}
