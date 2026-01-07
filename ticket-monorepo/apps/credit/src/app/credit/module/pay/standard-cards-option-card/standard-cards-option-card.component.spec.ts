import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardCardsOptionCardComponent } from './standard-cards-option-card.component';

describe('StandardCardsOptionCardComponent', () => {
  let component: StandardCardsOptionCardComponent;
  let fixture: ComponentFixture<StandardCardsOptionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardCardsOptionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardCardsOptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
