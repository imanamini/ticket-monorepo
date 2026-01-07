import { Component, input } from '@angular/core';
import { ClaimCardComponent } from '../../../../partials/claim-card/claim-card.component';
import { HistoryClaimListComponent } from '../history-claim-list/history-claim-list.component';
import { ClaimModel } from '../../../../../equipment/api/models/claim/claim-models';
import { claimStatus } from '../../../../../../util/badge-color';

@Component({
  selector: 'current-claim-list',
  standalone: true,
  imports: [
    HistoryClaimListComponent,
    ClaimCardComponent
  ],
  templateUrl: './current-claim-list.component.html',
  styleUrl: './current-claim-list.component.scss'
})
export class CurrentClaimListComponent {

  protected readonly claimStatus = claimStatus;

  claims = input.required<ClaimModel[]>();

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  // Mouse events for desktop
  onMouseDown(event: MouseEvent): void {
    const container = event.currentTarget as HTMLElement;
    this.isDragging = true;
    this.startX = event.pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const container = event.currentTarget as HTMLElement;
    const x = event.pageX - container.offsetLeft;
    const walk = (x - this.startX) * 2;
    container.scrollLeft = this.scrollLeft - walk;
  }

  onMouseUp(): void {
    this.isDragging = false;
    const container = document.querySelector('.active-claim-container') as HTMLElement;
    if (container) {
      container.style.cursor = 'grab';
    }
  }

  onMouseLeave(): void {
    if (this.isDragging) {
      this.isDragging = false;
      const container = document.querySelector('.active-claim-container') as HTMLElement;
      if (container) {
        container.style.cursor = 'grab';
      }
    }
  }

  // Touch events for mobile
  onTouchStart(event: TouchEvent): void {
    const container = event.currentTarget as HTMLElement;
    this.isDragging = true;
    this.startX = event.touches[0].pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    const container = event.currentTarget as HTMLElement;
    const x = event.touches[0].pageX - container.offsetLeft;
    const walk = (x - this.startX) * 2;
    container.scrollLeft = this.scrollLeft - walk;
  }

  onTouchEnd(): void {
    this.isDragging = false;
  }
}
