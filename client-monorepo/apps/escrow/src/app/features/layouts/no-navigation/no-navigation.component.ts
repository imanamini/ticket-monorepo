import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';

@Component({
  selector: 'escrow-no-navigation',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './no-navigation.component.html',
  styleUrl: './no-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class NoNavigationComponent implements OnInit {
  bottomNavigationService = inject(NgxBottomNavigationService);
  ngOnInit() {
    this.bottomNavigationService.hide();
  }
}
