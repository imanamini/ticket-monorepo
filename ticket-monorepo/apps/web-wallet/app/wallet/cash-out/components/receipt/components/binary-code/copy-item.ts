import { throwError } from 'rxjs';
import {ActivityInfo} from "../../../../models/cash-out.model";

export function Copy(activityInfo: ActivityInfo): Promise<boolean> {
  return new Promise((resolve) => {
    if (!activityInfo.copyable) {
      throwError('copyable filed does not accessible!');
      return;
    }
    const tempInput = document.createElement('input');
    tempInput.value = activityInfo.value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    resolve(true);
  });
}
