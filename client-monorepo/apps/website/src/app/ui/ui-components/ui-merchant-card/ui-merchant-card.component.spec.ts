import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMerchantCardComponent } from './ui-merchant-card.component';

describe('UiMerchantCardComponent', () => {
  let component: UiMerchantCardComponent;
  let fixture: ComponentFixture<UiMerchantCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiMerchantCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiMerchantCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
