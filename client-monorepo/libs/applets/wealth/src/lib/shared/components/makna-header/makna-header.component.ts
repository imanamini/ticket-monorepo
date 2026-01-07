import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

@Component({
  selector: 'app-makna-header',
  standalone: true,
  templateUrl: './makna-header.component.html',
  styleUrl: './makna-header.component.scss',
})
export class MaknaHeaderComponent {
  @Input({ required: true }) title: string;
  @Input() backUrl: string;
  @Input() width: string;
  @Input() height: string;
  @Output() onBackButtonClicked? = new EventEmitter();

  navigationService = inject(WealthNavigationService);

  onBackClicked() {
    this?.backUrl ? this.navigationService.navigate([this.backUrl]) : this.onBackButtonClicked.emit();
  }
}
