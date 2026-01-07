import { ComponentRef, Directive, effect, ElementRef, inject, input, Renderer2, ViewContainerRef } from '@angular/core';
import { StatusLightComponent } from './status-light.component';
import { StatusLightSizesEnum } from '../../data-access/constants/status-light-sizes.enum';
import { StatusLightColorsEnum } from '../../data-access/constants/status-light-colors.enum';
import { StatusLightBordersEnum } from '../../data-access/constants/status-light-boders.enum';

@Directive({
  selector: '[commonUiComponentsStatusLight]',
  standalone: true,
})
export class StatusLightDirective {
  // Injections
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private viewContainerRef = inject(ViewContainerRef);

  // Inputs
  showStatusLight = input<boolean>(false);
  statusSize = input<StatusLightSizesEnum | undefined>(StatusLightSizesEnum.TWELVE);
  statusColor = input<StatusLightColorsEnum | undefined>(StatusLightColorsEnum.GREEN);
  statusBorderColor = input<StatusLightBordersEnum | undefined>(StatusLightBordersEnum.NONE);

  // Variables
  private componentRef: ComponentRef<StatusLightComponent> | null = null;

  constructor() {
    effect(() => {
      if (this.showStatusLight() && this.statusSize() && this.statusColor() && this.statusBorderColor()) {
        this.attachStatusLight();
      } else {
        this.removeStatusLight();
      }
    });
  }

  private attachStatusLight(): void {
    if (!this.componentRef) {
      this.componentRef = this.viewContainerRef.createComponent(StatusLightComponent);
    }
    this.componentRef.setInput('showStatusLight', this.showStatusLight());
    this.componentRef.setInput('statusSize', this.statusSize());
    this.componentRef.setInput('statusColor', this.statusColor());
    this.componentRef.setInput('statusBorderColor', this.statusBorderColor());
    const element = this.componentRef.location.nativeElement;
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.appendChild(this.el.nativeElement, element);
  }

  private removeStatusLight(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
