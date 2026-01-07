import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiInternetPackageConfirmComponent } from './ui-internet-package-confirm.component';

describe('UiInternetPackageConfirmComponent', () => {
  let component: UiInternetPackageConfirmComponent;
  let fixture: ComponentFixture<UiInternetPackageConfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiInternetPackageConfirmComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiInternetPackageConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
