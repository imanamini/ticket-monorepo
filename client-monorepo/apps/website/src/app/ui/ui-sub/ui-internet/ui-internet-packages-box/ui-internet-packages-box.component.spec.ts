import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiInternetPackagesBoxComponent } from './ui-internet-packages-box.component';

describe('UiInternetPackagesBoxComponent', () => {
  let component: UiInternetPackagesBoxComponent;
  let fixture: ComponentFixture<UiInternetPackagesBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiInternetPackagesBoxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiInternetPackagesBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
