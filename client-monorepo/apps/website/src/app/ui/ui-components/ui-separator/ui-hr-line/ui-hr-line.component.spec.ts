import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiHrLineComponent } from './ui-hr-line.component';

describe('UiHrLineComponent', () => {
  let component: UiHrLineComponent;
  let fixture: ComponentFixture<UiHrLineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiHrLineComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiHrLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
