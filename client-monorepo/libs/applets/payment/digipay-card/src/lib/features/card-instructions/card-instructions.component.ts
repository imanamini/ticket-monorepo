import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'digipay-card-applet-card-instructions',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, DpIconComponent],
  templateUrl: './card-instructions.component.html',
  styleUrl: './card-instructions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardInstructionsComponent {}
