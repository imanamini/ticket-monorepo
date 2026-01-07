import { DigipayJsInterface } from '@digipay/ng-payment';
import { HybridJsInterface } from './hybrid-interface';
import { PostMessage } from '../models/post-message.model';
import { InsuranceJsInterface } from './insurance-js-interface';

export interface AppWindow extends Window {
  DigipayJsInterface: InsuranceJsInterface;
  digipay: DigipayJsInterface;
  digipayWebApp: DigipayJsInterface;
  digipayHybridApp: HybridJsInterface;
  iosWebViewHandler: {
    setDeviceInfo?: (deviceInfo: string) => void;
    setContact?: (phoneNumber: string, contactName: string) => void;
  };
  webkit: {
    messageHandlers: {
      getDeviceInfo: PostMessage<string>;
      getContact: PostMessage<string>;
      openUrl?: PostMessage<string>;
    };
  };
}
