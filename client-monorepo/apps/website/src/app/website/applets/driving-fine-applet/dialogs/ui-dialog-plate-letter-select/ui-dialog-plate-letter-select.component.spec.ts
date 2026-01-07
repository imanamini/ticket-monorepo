import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDialogPlateLetterSelectComponent } from './ui-dialog-plate-letter-select.component';

describe('UiDialogPlateLetterSelectComponent', () => {
  let component: UiDialogPlateLetterSelectComponent;
  let fixture: ComponentFixture<UiDialogPlateLetterSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiDialogPlateLetterSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDialogPlateLetterSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
