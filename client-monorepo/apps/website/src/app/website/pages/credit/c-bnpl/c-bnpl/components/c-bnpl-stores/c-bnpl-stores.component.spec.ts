import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBnplStoresComponent } from './c-bnpl-stores.component';

describe('CBnplStoresComponent', () => {
  let component: CBnplStoresComponent;
  let fixture: ComponentFixture<CBnplStoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CBnplStoresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CBnplStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
