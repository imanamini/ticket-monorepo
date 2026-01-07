import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletManagementDescriptionStepperComponent } from './wallet-management-description-stepper.component';

describe('WalletManagementDescriptionStepperComponent', () => {
  let component: WalletManagementDescriptionStepperComponent;
  let fixture: ComponentFixture<WalletManagementDescriptionStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletManagementDescriptionStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletManagementDescriptionStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
