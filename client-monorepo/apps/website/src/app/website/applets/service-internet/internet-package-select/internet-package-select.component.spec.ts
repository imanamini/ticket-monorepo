import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternetPackageSelectComponent } from './internet-package-select.component';

describe('InternetPackageSelectComponent', () => {
  let component: InternetPackageSelectComponent;
  let fixture: ComponentFixture<InternetPackageSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InternetPackageSelectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetPackageSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
