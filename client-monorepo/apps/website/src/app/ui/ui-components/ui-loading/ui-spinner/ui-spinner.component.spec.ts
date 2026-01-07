import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiSpinnerComponent } from './ui-spinner.component';

describe('UiSpinnerComponent', () => {
  let component: UiSpinnerComponent;
  let fixture: ComponentFixture<UiSpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiSpinnerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
