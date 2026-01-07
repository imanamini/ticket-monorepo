import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListSkeletonComponent } from './products-list-skeleton.component';

describe('ProductsListSkeletonComponent', () => {
  let component: ProductsListSkeletonComponent;
  let fixture: ComponentFixture<ProductsListSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsListSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
