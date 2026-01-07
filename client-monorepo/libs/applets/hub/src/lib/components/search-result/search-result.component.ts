import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { FrequentServiceInterface } from '@client-monorepo/common/service-data';
import { FramedIconComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { NgxRouterLoadingDirective } from '@digipay/ngx-router-loading';

@Component({
  selector: 'hub-applet-search-result',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent, FramedIconComponent, NgxRouterLoadingDirective],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent {
  isLoading = input(false);
  service = input<FrequentServiceInterface>({} as FrequentServiceInterface);
  clicked = output<FrequentServiceInterface>();

  handleClick(): void {
    if (!this.isLoading() && this.service()) {
      this.clicked.emit(this.service());
    }
  }

  protected readonly ServiceImagesType = ServiceImagesType;
}
