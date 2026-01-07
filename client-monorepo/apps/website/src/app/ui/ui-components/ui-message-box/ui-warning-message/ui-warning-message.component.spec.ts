import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiWarningMessageComponent } from './ui-warning-message.component';

describe('UiWarningMessageComponent', () => {
  let component: UiWarningMessageComponent;
  let fixture: ComponentFixture<UiWarningMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiWarningMessageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiWarningMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
