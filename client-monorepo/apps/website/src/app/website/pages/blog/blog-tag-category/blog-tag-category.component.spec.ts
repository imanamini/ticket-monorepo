import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogTagCategoryComponent } from './blog-tag-category.component';

describe('BlogTagCategoryComponent', () => {
  let component: BlogTagCategoryComponent;
  let fixture: ComponentFixture<BlogTagCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogTagCategoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogTagCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
