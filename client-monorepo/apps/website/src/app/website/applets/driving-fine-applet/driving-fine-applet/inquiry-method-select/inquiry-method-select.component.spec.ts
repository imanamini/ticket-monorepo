import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryMethodSelectComponent } from './inquiry-method-select.component';

describe('InquiryMethodSelectComponent', () => {
  let component: InquiryMethodSelectComponent;
  let fixture: ComponentFixture<InquiryMethodSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InquiryMethodSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InquiryMethodSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
