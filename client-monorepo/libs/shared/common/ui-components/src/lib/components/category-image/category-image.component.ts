import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignService } from '@client-monorepo/campaign';

@Component({
  selector: 'common-ui-components-category-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-image.component.html',
  styleUrl: './category-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryImageComponent {
  image = input.required<string>();
  size = input<'56' | '64' | '84'>('64');
  campaignService = inject(CampaignService);

  computedImage = computed(() => this.computeImageBasedOnCampaign());

  computeImageBasedOnCampaign(): string {
    if (this.campaignService.activeCampaign()?.assetsPrefix) {
      const name = this.image().substring(this.image().lastIndexOf('/') + 1);
      return this.image().replace(name, this.campaignService.activeCampaign()?.assetsPrefix + name);
    }
    return this.image();
  }
}
