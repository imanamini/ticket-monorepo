import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiInquiryMethodCardComponent } from './ui-inquiry-method-card.component';

describe('UiInquiryMethodCardComponent', () => {
  let component: UiInquiryMethodCardComponent;
  let fixture: ComponentFixture<UiInquiryMethodCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiInquiryMethodCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiInquiryMethodCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
