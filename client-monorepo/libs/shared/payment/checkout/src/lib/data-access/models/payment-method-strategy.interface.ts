import { CardConfigInterface } from './card-config.interface';

export interface PaymentMethodStrategyInterface {
  next(): Promise<void>;

  config(): CardConfigInterface | null;
}
