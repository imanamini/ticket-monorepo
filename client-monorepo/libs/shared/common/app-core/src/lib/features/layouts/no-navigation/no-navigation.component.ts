import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';

@Component({
  selector: 'dpx-no-navigation',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './no-navigation.component.html',
  styleUrl: './no-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class NoNavigationComponent implements OnInit, OnDestroy {
  bottomNavigationService = inject(NgxBottomNavigationService);
  timeOut!: any;
  ngOnInit() {
    this.timeOut = setTimeout(() => {
      this.bottomNavigationService.hide();
    }, 0);
  }

  ngOnDestroy() {
    clearTimeout(this.timeOut);
  }
}
