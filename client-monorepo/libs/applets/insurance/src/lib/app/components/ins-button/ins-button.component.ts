import { Component, input, OnDestroy, output, signal } from '@angular/core';
import { ButtonIcon, NgxButtonComponent } from '@digipay/ngx-button';

import { InsButtonStyleEnum } from '../../data-access/enums/ins-button-style.enum';
import { InsButtonModeEnum } from '../../data-access/enums/ins-button-mode.enum';
import { InsButtonSizeEnum } from '../../data-access/enums/ins-button-size.enum';
import { ElementIdAssignerService } from '../../data-access/services/element-id-assigner.service';
import { ButtonStylePipe } from '../../pipes/button-style/button-style.pipe';

@Component({
  selector: 'ins-button',
  standalone: true,
  imports: [
    NgxButtonComponent,
    ButtonStylePipe
  ],
  templateUrl: './ins-button.component.html',
  styleUrl: './ins-button.component.scss',
  host: {
    role: 'button',
    '[style.width]': 'fullWidth()? "100%" : "none"'
  }
})

export class InsButtonComponent implements OnDestroy {

  mode = input<InsButtonModeEnum>(InsButtonModeEnum.Form);
  style = input<InsButtonStyleEnum>(InsButtonStyleEnum.Brand);
  size = input<InsButtonSizeEnum>(InsButtonSizeEnum.Medium);
  destructive = input<boolean>(false);
  disabled = input<boolean>(false);
  isLoading = input<boolean>(false);
  fullWidth = input<boolean>(false);
  brandButton = input<boolean>(false);
  leftIcon = input<ButtonIcon>();
  rightIcon = input<ButtonIcon>();
  text = input<string>('');
  classNames = input<string[]>([]);
  id = signal<string>(null);

  clickHandler = output<any>();

  constructor(
    private elementIdAssignerService: ElementIdAssignerService,
  ) {
    this.id.set(this.elementIdAssignerService.getId());
  }

  handleClicked(e: any): void {
    this.clickHandler.emit(e);
  }

  ngOnDestroy(): void {
    this.elementIdAssignerService.elementDestroyed();
  }

}
