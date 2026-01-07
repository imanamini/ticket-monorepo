import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiFormHintComponent } from './ui-form-hint.component';

describe('UiFormHintComponent', () => {
  let component: UiFormHintComponent;
  let fixture: ComponentFixture<UiFormHintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiFormHintComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiFormHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
