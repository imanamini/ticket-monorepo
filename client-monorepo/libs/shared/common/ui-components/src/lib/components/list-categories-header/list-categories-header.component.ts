import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedSectionHeader } from '../../data-access/models/selected-section.type';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { AbTestService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'common-ui-components-list-categories-header',
  standalone: true,
  imports: [CommonModule, ApiImageModule],
  templateUrl: './list-categories-header.component.html',
  styleUrl: './list-categories-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCategoriesHeaderComponent {
  config = input<SelectedSectionHeader>();
  forceNewVersion = input<boolean>(false);

  protected readonly ServiceImagesType = ServiceImagesType;
  protected readonly AbTestService = AbTestService;
}
