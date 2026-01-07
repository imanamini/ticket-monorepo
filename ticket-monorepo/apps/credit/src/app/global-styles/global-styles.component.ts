import {Component, ViewEncapsulation} from '@angular/core';
import { isInstalledOnDevice, isIOsDevice, isSafariBrowser } from "../utils/device";

@Component({
  selector: 'app-global-styles',
  templateUrl: './global-styles.component.html',
  styleUrls: ['./global-styles.component.scss'],
  encapsulation: ViewEncapsulation.None // No encapsulation, apply the styles to the all pages
})

export class GlobalStylesComponent {

  deviceIsSupported(){
    // return true;
    return isIOsDevice() && isSafariBrowser() && isInstalledOnDevice();
  }

}



