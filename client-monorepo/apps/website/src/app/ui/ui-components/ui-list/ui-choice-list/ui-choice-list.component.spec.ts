import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiChoiceListComponent } from './ui-choice-list.component';

describe('UiChoiceListComponent', () => {
  let component: UiChoiceListComponent;
  let fixture: ComponentFixture<UiChoiceListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiChoiceListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiChoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
