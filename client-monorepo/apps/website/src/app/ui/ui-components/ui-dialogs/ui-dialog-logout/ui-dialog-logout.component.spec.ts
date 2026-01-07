import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDialogLogoutComponent } from './ui-dialog-logout.component';

describe('UiDialogLogoutComponent', () => {
  let component: UiDialogLogoutComponent;
  let fixture: ComponentFixture<UiDialogLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiDialogLogoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDialogLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
