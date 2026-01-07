import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsanKharidProductListComponent } from './asan-kharid-product-list.component';

describe('AsanKharidProductListComponent', () => {
  let component: AsanKharidProductListComponent;
  let fixture: ComponentFixture<AsanKharidProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsanKharidProductListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsanKharidProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
