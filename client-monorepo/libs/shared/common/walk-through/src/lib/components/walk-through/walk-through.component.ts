import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalkThroughService } from '../../data-access/services/walk-through.service';
import { WalkThroughConfig } from '../../data-access/models/walk-through-config';
import { WalkThroughStepComponent } from '../walk-through-step/walk-through-step.component';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-walk-through',
  standalone: true,
  imports: [CommonModule, WalkThroughStepComponent, NgxButtonComponent],
  templateUrl: './walk-through.component.html',
  styleUrl: './walk-through.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalkThroughComponent implements AfterViewInit {
  config = computed<WalkThroughConfig | undefined>(() => this.walkThroughService.config());
  showWalkThrough = computed(() => {
    if (this.initialized()) {
      return this.walkThroughService.isWalkThroughVisible();
    } else {
      return false;
    }
  });
  initialized = signal(false);

  walkThroughService = inject(WalkThroughService);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initialized.set(true);
    }, 100);
  }

  closeWalkThrough(): void {
    this.walkThroughService.done();
  }
}
