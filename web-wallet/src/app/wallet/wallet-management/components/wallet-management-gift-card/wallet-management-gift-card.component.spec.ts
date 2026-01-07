import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletManagementGiftCardComponent } from './wallet-management-gift-card.component';

describe('WalletManagementGiftCardComponent', () => {
  let component: WalletManagementGiftCardComponent;
  let fixture: ComponentFixture<WalletManagementGiftCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletManagementGiftCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletManagementGiftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
