import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDialogCompensateServiceCostShortageComponent } from './ui-dialog-compensate-service-cost-shortage.component';

describe('UiDialogCompensateServiceCostShortageComponent', () => {
  let component: UiDialogCompensateServiceCostShortageComponent;
  let fixture: ComponentFixture<UiDialogCompensateServiceCostShortageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiDialogCompensateServiceCostShortageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDialogCompensateServiceCostShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
