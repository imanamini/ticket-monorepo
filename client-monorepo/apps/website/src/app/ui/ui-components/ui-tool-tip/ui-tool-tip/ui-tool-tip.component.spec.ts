import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiToolTipComponent } from './ui-tool-tip.component';

describe('UiToolTipComponent', () => {
  let component: UiToolTipComponent;
  let fixture: ComponentFixture<UiToolTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiToolTipComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiToolTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
