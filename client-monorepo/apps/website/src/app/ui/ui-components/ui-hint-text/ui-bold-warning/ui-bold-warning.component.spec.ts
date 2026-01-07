import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiBoldWarningComponent } from './ui-bold-warning.component';

describe('UiBoldWarningComponent', () => {
  let component: UiBoldWarningComponent;
  let fixture: ComponentFixture<UiBoldWarningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiBoldWarningComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiBoldWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
