import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletManagementActionButtonComponent } from './wallet-management-action-button.component';

describe('WalletManagementActionButtonComponent', () => {
  let component: WalletManagementActionButtonComponent;
  let fixture: ComponentFixture<WalletManagementActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletManagementActionButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletManagementActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
