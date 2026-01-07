import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastInquiryReportComponent } from './last-inquiry-report.component';

describe('LastInquiryReportComponent', () => {
  let component: LastInquiryReportComponent;
  let fixture: ComponentFixture<LastInquiryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LastInquiryReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LastInquiryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
