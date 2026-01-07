import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CollateralTabs } from '../../../../../../../../api/clients/models/templates/c-credit/providers/providers-template-data';
import { UiComplexAccordionComponent } from '../../../../../../../../ui/ui-components/ui-complex-accordion/ui-complex-accordion/ui-complex-accordion.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-providers-segments',
  templateUrl: './providers-segments.component.html',
  styleUrls: ['./providers-segments.component.scss'],
  standalone: true,
  imports: [NgIf, UiComplexAccordionComponent],
})
export class ProvidersSegmentsComponent implements OnInit, OnChanges {
  @Input() collateralTabs: CollateralTabs[] = [];
  @Input() selectedCollateral: string;

  collateralValue = 0;
  protected readonly parseInt = parseInt;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.collateralValue = this.collateralTabs.findIndex((tab) => tab.collateralType === this.selectedCollateral);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedCollateral.currentValue) {
      this.collateralValue = this.collateralTabs.findIndex((tab) => tab.collateralType === this.selectedCollateral);
    }
    this.changeDetector.detectChanges();
  }
}
