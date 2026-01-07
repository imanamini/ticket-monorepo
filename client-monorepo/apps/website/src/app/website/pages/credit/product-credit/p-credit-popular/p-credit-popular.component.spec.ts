import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PCreditPopularComponent } from './p-credit-popular.component';

describe('PCreditPopularComponent', () => {
  let component: PCreditPopularComponent;
  let fixture: ComponentFixture<PCreditPopularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PCreditPopularComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PCreditPopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
