import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiSimCardComponent } from './ui-sim-card.component';

describe('UiSimCardComponent', () => {
  let component: UiSimCardComponent;
  let fixture: ComponentFixture<UiSimCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiSimCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSimCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
