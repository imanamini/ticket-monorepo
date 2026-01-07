import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserApiService } from '@client-monorepo/common/user';

@Component({
  selector: 'common-journey-management-graceful-journey',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graceful-journey.component.html',
  styleUrl: './graceful-journey.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GracefulJourneyComponent implements OnInit {
  name = signal<string | undefined>(undefined);
  userApiService = inject(UserApiService);

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    this.userApiService.getProfile().subscribe({
      next: (userData) => {
        this.name.set(userData.name ?? undefined);
      },
    });
  }
}
