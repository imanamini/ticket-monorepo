import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardCardsBottomSheetComponent } from './standard-cards-bottom-sheet.component';

describe('StandardCardsBottomSheetComponent', () => {
  let component: StandardCardsBottomSheetComponent;
  let fixture: ComponentFixture<StandardCardsBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardCardsBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardCardsBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
