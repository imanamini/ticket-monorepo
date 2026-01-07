import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMerchantCardComponent } from './single-merchant-card.component';

describe('SingleMerchantCardComponent', () => {
  let component: SingleMerchantCardComponent;
  let fixture: ComponentFixture<SingleMerchantCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleMerchantCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleMerchantCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
