import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiInternetPackageComponent } from './ui-internet-package.component';

describe('UiInternetPackageComponent', () => {
  let component: UiInternetPackageComponent;
  let fixture: ComponentFixture<UiInternetPackageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiInternetPackageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiInternetPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
