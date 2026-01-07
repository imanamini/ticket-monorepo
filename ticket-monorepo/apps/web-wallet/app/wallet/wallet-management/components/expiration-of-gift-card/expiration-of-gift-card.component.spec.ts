import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirationOfGiftCardComponent } from './expiration-of-gift-card.component';

describe('ExpirationOfGiftCardComponent', () => {
  let component: ExpirationOfGiftCardComponent;
  let fixture: ComponentFixture<ExpirationOfGiftCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpirationOfGiftCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpirationOfGiftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
