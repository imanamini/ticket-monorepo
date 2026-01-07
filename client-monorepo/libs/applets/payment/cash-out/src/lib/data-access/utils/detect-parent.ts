import {ParentType} from "../models/parent.model";

export function detectParent(url: string): ParentType {
  if (url.includes('wallet-transfer')) {
    return 'wallet-transfer';
  } else if (url.includes('setting')) {
    return 'setting';
  } else {
    return 'none'
  }

}
