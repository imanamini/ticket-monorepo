import { CardConfigInterface } from '../../card/card-config.interface';

export interface PaymentMethodStrategyInterface {
  next(): Promise<void>;

  config(): CardConfigInterface;
}
