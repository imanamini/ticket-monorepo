import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogArchivePaginationComponent } from './blog-archive-pagination.component';

describe('BlogArchivePaginationComponent', () => {
  let component: BlogArchivePaginationComponent;
  let fixture: ComponentFixture<BlogArchivePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogArchivePaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogArchivePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
