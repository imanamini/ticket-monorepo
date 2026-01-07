import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, signal } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../credit-environment.interface';

@Component({
  selector: 'credit-digipay-image',
  templateUrl: './credit-digipay-image.component.html',
  styleUrls: ['./credit-digipay-image.component.scss'],
  standalone: true,
  imports: [ApiImageModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditDigipayImageComponent {
  imageId = input.required<string>();
  public creditEnvironment = inject<CreditEnvironmentInterface>(CREDIT_ENVIRONMENT);
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';

  processedImageId = computed(() => {
    const id = this.imageId();
    if (!id) return '';
    return this.isPillar ? `${id}` : id;
  });

  width = model<string>('');

  height = model<string>('');

  borderRadius = input<string>('8px');

  heightSkeleton = input<string>('');

  centered = input<string>();

  styles = input<object>({});

  image = signal<SafeResourceUrl | null>(null);

  loadError = output<any>();

  apiEndpoint = input<'FILE_SERVER' | 'CREDIT'>('FILE_SERVER');

  baseUrl = computed(() => {
    if (this.apiEndpoint() === 'CREDIT') {
      return `digipay/api/contents/`;
    } else {
      return `digipay/api/files/`;
    }
  });

  getImageStyles() {
    const styles: { [key: string]: string } = { ...this.styles() };

    if (this.width()) {
      styles['width'] = this.width()!;
    }
    if (this.height) {
      styles['height'] = this.height()!;
    }

    if (this.centered()) {
      styles['margin-left'] = 'auto';
      styles['margin-right'] = 'auto';
      styles['display'] = 'block';
    }

    return styles;
  }
}
