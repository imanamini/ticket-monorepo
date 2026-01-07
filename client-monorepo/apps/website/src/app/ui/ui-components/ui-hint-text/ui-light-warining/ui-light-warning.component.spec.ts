import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiLightWarningComponent } from './ui-light-warning.component';

describe('UiLightWariningComponent', () => {
  let component: UiLightWarningComponent;
  let fixture: ComponentFixture<UiLightWarningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiLightWarningComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiLightWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
