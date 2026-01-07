import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';

@Component({
  selector: 'digipay-card-applet-password-setting',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, DpIconComponent, RouterLink],
  templateUrl: './password-setting.component.html',
  styleUrl: './password-setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordSettingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  id = signal<string>('');
 
  ngOnInit(): void {
    this.id.set(this.route.snapshot.paramMap.get('id') as string);
  }
}
