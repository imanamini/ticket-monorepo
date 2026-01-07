import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CreditGenerateDigitalSignaturePermissionComponent } from './credit-generate-digital-signature-permission/credit-generate-digital-signature-permission.component';
import { CreditGenerateDigitalSignaturePermissionFailedComponent } from './credit-generate-digital-signature-permission-failed/credit-generate-digital-signature-permission-failed.component';
import { CreditUrlService } from '../../../data-access/utils/url';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditGenerateDigitalSignatureCaptureFaceComponent } from './credit-generate-digital-signature-capture-face/credit-generate-digital-signature-capture-face.component';
import { DigitalSignatureStepperUrl } from '../credit-generate-digital-signature-step/general-digital-signature-steps.model';
import { CreditGenerateDigitalSignatureService } from '../services/credit-generate-digital-signature.service';
import { CreditGenerateDigitalSignatureUpdateIosComponent } from '../credit-generate-digital-signature-update-ios/credit-generate-digital-signature-update-ios.component';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../../credit-environment.interface';
import { isIOsDevice } from '../../../data-access/utils/device';

type STATE = 'PERMISSION' | 'FAILED' | 'CAPTURE' | 'UPDATE_IOS';

@Component({
  selector: 'app-credit-generate-digital-signature-image-capture-face-step',
  standalone: true,
  imports: [
    CreditGenerateDigitalSignaturePermissionComponent,
    CreditGenerateDigitalSignaturePermissionFailedComponent,
    CreditGenerateDigitalSignatureCaptureFaceComponent,
    CreditGenerateDigitalSignatureUpdateIosComponent,
  ],
  templateUrl: './credit-generate-digital-signature-image-capture-face-step.component.html',
  styleUrl: './credit-generate-digital-signature-image-capture-face-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureImageCaptureFaceStepComponent implements OnInit {
  fundProviderCode = signal<number | null>(null);
  creditId = signal<string | null>(null);
  type = signal<'PHOTO' | 'VIDEO'>('PHOTO');
  state = signal<STATE>('PERMISSION');
  private creditUrlService = inject(CreditUrlService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private creditGenerateDigitalSignatureService = inject(CreditGenerateDigitalSignatureService);

  constructor(
    @Inject(CREDIT_ENVIRONMENT)
    private creditEnvironment: CreditEnvironmentInterface,
  ) {}

  ngOnInit(): void {
    this.fundProviderCode.set(+this.activatedRoute.parent?.snapshot.params['fundProviderCode']);
    this.creditId.set(this.activatedRoute.parent?.snapshot.params['creditId']);
    this.type.set(this.activatedRoute.snapshot.url[0].path === 'take-photo' ? 'PHOTO' : 'VIDEO');
    this.creditGenerateDigitalSignatureService.setDigitalSignatureAutoNavigation(false);
    if (this.creditEnvironment.creditEnv === 'mini-app' && isIOsDevice()) {
      this.state.set('UPDATE_IOS');
    }
  }

  changeState(newState: STATE) {
    this.state.set(newState);
  }

  backToStepper() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode()}/${this.creditId()}`),
    );
  }
}
