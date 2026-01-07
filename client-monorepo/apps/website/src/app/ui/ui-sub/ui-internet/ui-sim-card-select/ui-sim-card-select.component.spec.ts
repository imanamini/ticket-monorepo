import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiSimCardSelectComponent } from './ui-sim-card-select.component';

describe('UiSimCardSelectComponent', () => {
  let component: UiSimCardSelectComponent;
  let fixture: ComponentFixture<UiSimCardSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiSimCardSelectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSimCardSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
