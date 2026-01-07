import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCategoryFilterComponent } from './single-category-filter.component';

describe('SingleCategoryFilterComponent', () => {
  let component: SingleCategoryFilterComponent;
  let fixture: ComponentFixture<SingleCategoryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleCategoryFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleCategoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
