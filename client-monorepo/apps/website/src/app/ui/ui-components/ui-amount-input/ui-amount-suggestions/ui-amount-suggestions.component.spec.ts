import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiAmountSuggestionsComponent } from './ui-amount-suggestions.component';

describe('UiAmountSuggestionsComponent', () => {
  let component: UiAmountSuggestionsComponent;
  let fixture: ComponentFixture<UiAmountSuggestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiAmountSuggestionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiAmountSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
