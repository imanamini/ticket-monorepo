import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoursePromotionComponent } from './bourse-promotion.component';

describe('BoursePromotionComponent', () => {
  let component: BoursePromotionComponent;
  let fixture: ComponentFixture<BoursePromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoursePromotionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoursePromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
