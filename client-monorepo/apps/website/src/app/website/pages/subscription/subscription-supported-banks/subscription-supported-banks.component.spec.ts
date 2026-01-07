import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionSupportedBanksComponent } from './subscription-supported-banks.component';

describe('SubscriptionSupportedBanksComponent', () => {
  let component: SubscriptionSupportedBanksComponent;
  let fixture: ComponentFixture<SubscriptionSupportedBanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionSupportedBanksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionSupportedBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
