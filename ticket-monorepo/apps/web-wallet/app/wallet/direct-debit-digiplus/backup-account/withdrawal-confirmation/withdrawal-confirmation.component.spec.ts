import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalConfirmationComponent } from './withdrawal-confirmation.component';

describe('WithdrawalConfirmationDialogComponent', () => {
  let component: WithdrawalConfirmationComponent;
  let fixture: ComponentFixture<WithdrawalConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawalConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
