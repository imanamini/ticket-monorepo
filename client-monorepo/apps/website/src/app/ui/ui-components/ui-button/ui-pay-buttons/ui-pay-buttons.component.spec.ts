import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiPayButtonsComponent } from './ui-pay-buttons.component';

describe('UiPayButtonsComponent', () => {
  let component: UiPayButtonsComponent;
  let fixture: ComponentFixture<UiPayButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiPayButtonsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiPayButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
