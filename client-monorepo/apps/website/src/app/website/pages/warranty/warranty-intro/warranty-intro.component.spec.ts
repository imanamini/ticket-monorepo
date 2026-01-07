import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyIntroComponent } from './warranty-intro.component';

describe('WarrantyIntroComponent', () => {
  let component: WarrantyIntroComponent;
  let fixture: ComponentFixture<WarrantyIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarrantyIntroComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
