import { inject, Injectable } from '@angular/core';
import { ScreenType } from '../models/screen.type';
import {ScreenSize} from "../../../api/models/screen-size";
import {LayoutService} from "../../../core/services/layout.service";

@Injectable()
export class ScreenService {
  public state: ScreenType;
  private layout = inject(LayoutService);

  public detectScreen(): ScreenType {
    this.state = this.layout.currentSize === ScreenSize.XS ? 'MOBILE' : 'DESKTOP';
    return this.state;
  }
}
