import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiBlockLineComponent } from './ui-block-line.component';

describe('UiBlockLineComponent', () => {
  let component: UiBlockLineComponent;
  let fixture: ComponentFixture<UiBlockLineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiBlockLineComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiBlockLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
