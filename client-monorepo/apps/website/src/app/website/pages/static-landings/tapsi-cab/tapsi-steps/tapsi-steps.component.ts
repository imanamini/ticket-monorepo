import {ChangeDetectionStrategy, Component, computed, input, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TapsiCabTemplateData} from "../../../../../api/clients/models/templates/tapsi-cab/tapsi-cab-template-data";
import {BorderColorsEnum, NgxDividerComponent} from "@digipay/ngx-divider";
import {TapsiStepItemComponent} from "../tapsi-step-item/tapsi-step-item.component";
import {
  AboutUsHistoryItemComponent
} from "../../../about-us/about-us-history/about-us-history-item/about-us-history-item.component";

@Component({
  selector: 'app-tapsi-steps',
  standalone: true,
  imports: [CommonModule, NgxDividerComponent, TapsiStepItemComponent, AboutUsHistoryItemComponent],
  templateUrl: './tapsi-steps.component.html',
  styleUrl: './tapsi-steps.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TapsiStepsComponent {


  templateData = input<TapsiCabTemplateData | null>(null);
  activeIndex = signal(0);

  setActiveIndex(index: number): void {
    this.activeIndex.set(index);
  }

  activeHistoryItem = computed(() => {
    const index = this.activeIndex();
    return this.templateData().paySteps?.history[index];
  })
  protected readonly BorderColorsEnum = BorderColorsEnum;
}
