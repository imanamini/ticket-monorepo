import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCategoriesComponent } from './credit-categories.component';

describe('CreditCategoriesComponent', () => {
  let component: CreditCategoriesComponent;
  let fixture: ComponentFixture<CreditCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditCategoriesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
