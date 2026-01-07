import { booleanAttribute, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { PLANS_TYPE } from '@client-monorepo/common/subscription';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[planType]',
  standalone: true,
})
export class PlanTypeDirective {
  @Input({ transform: booleanAttribute }) isSelectedPlan = false;

  @Input() set planType(type: PLANS_TYPE) {
    // Define styles based on types
    let color = '';
    let planBackgroundImage = '';
    let planIcon = '';
    let selectedBackgroundImage = '';
    switch (type) {
      case PLANS_TYPE.PLATINUM:
        color = '#000000';
        planIcon = 'url("assets/subscription/images/banners/plan-banners/icon-plan-type-platinum.svg';
        planBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-platinum.svg")';
        selectedBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-detail-platinum.svg")';
        break;
      case PLANS_TYPE.GOLD:
        color = '#000000';
        planIcon = 'url("assets/subscription/images/banners/plan-banners/icon-plan-type-gold.svg")';
        planBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-gold.svg")';
        selectedBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-detail-gold.svg")';
        break;
      case PLANS_TYPE.SILVER:
        color = '#000000';
        planIcon = 'url("assets/subscription/images/banners/plan-banners/icon-plan-type-silver.svg")';
        planBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-silver.svg")';
        selectedBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-detail-silver.svg")';
        break;
      case PLANS_TYPE.BRONZE:
        color = '#000000';
        planIcon = 'url("assets/subscription/images/banners/plan-banners/icon-plan-type-bronze.svg")';
        planBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-bronze.svg")';
        selectedBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-detail-bronze.svg")';
        break;
      case PLANS_TYPE.BRILLIANCE:
        color = '#000000';
        planIcon = 'url("assets/subscription/images/banners/plan-banners/icon-plan-type-brilliance.svg")';
        planBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-brilliance.svg")';
        selectedBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-detail-brilliance.svg")';
        break;
      case PLANS_TYPE.DIAMOND:
        color = '#000000';
        planIcon = 'url("assets/subscription/images/banners/plan-banners/icon-plan-type-diamond.svg")';
        planBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-diamond.svg")';
        selectedBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-detail-diamond.svg")';
        break;
      case PLANS_TYPE.TITANIUM:
        color = '#000000';
        planIcon = 'url("assets/subscription/images/banners/plan-banners/icon-plan-type-titanium.svg")';
        planBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-titanium.svg")';
        selectedBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-detail-titanium.svg")';
        break;
      case PLANS_TYPE.PAY_PLUS:
        color = '#000000';
        planIcon = 'url("assets/subscription/images/banners/plan-banners/icon-plan-type-pay-plus.png")';
        planBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-pay-plus.svg")';
        selectedBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-detail-pay-plus.svg")';
        break;
      case PLANS_TYPE.PAY_PRO:
        color = '#000000';
        planIcon = 'url("assets/subscription/images/banners/plan-banners/icon-plan-type-pay-pro.svg")';
        planBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-pay-pro.svg")';
        selectedBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-detail-pay-pro.svg")';
        break;
      default:
        // Default styles
        color = '#000000';
        planIcon = 'url("assets/subscription/images/banners/plan-banners/icon-plan-type-gold';
        planBackgroundImage = 'url("assets/subscription/images/banners/plan-banners/bg-plan-card-gold.svg")';
        selectedBackgroundImage = '';
        break;
    }

    // Apply styles to the element
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
    this.renderer.setStyle(this.el.nativeElement, 'background-image', this.isSelectedPlan ? selectedBackgroundImage : planBackgroundImage);
    const planIconElement = this.el.nativeElement.querySelector('.plan-icon');
    if (planIconElement) {
      this.renderer.setStyle(planIconElement, 'background-image', planIcon);
    }
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}
}
