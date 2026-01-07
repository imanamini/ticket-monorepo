import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiCarrierSelectComponent } from './ui-carrier-select.component';

describe('UiCarrierSelectComponent', () => {
  let component: UiCarrierSelectComponent;
  let fixture: ComponentFixture<UiCarrierSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiCarrierSelectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCarrierSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
