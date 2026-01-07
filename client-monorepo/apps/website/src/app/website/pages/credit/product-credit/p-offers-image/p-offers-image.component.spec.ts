import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POffersImageComponent } from './p-offers-image.component';

describe('POffersImageComponent', () => {
  let component: POffersImageComponent;
  let fixture: ComponentFixture<POffersImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [POffersImageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POffersImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
