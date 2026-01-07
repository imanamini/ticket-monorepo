import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDialogFilterComponent } from './ui-dialog-filter.component';

describe('UiDialogFilterComponent', () => {
  let component: UiDialogFilterComponent;
  let fixture: ComponentFixture<UiDialogFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiDialogFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDialogFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
