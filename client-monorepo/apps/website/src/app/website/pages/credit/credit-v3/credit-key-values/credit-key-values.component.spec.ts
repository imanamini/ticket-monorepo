import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditKeyValuesComponent } from './credit-key-values.component';

describe('CreditKeyValuesComponent', () => {
  let component: CreditKeyValuesComponent;
  let fixture: ComponentFixture<CreditKeyValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditKeyValuesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditKeyValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
