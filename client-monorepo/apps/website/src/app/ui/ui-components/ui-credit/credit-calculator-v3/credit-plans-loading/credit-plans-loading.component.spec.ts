import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPlansLoadingComponent } from './credit-plans-loading.component';

describe('CreditPlansLoadingComponent', () => {
  let component: CreditPlansLoadingComponent;
  let fixture: ComponentFixture<CreditPlansLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditPlansLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditPlansLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
