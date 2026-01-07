import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSimTypeSwitchComponent } from './ui-sim-type-switch.component';

describe('UiSimTypeSwitchComponent', () => {
  let component: UiSimTypeSwitchComponent;
  let fixture: ComponentFixture<UiSimTypeSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiSimTypeSwitchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSimTypeSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
