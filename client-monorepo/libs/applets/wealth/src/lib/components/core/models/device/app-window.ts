import { DigipayJsInterface } from '@digipay/ng-payment';
import { HybridJsInterface } from '../../web-interface/hybrid-interface';
import { PostMessage } from './post-message.model';

export interface AppWindow extends Window {
  digipay: DigipayJsInterface;
  digipayWebApp: DigipayJsInterface;
  digipayHybridApp: HybridJsInterface;
  iosWebViewHandler: {
    setDeviceInfo?: (deviceInfo: string) => void
    setContact?: (phoneNumber: string, contactName: string) => void;
  };
  webkit: {
    messageHandlers: {
      getDeviceInfo: PostMessage<string>,
      getContact: PostMessage<string>,
      openUrl?: PostMessage<string>
    },
  };
}
