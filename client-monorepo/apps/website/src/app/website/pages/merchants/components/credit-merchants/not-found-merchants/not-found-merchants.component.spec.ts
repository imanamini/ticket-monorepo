import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundMerchantsComponent } from './not-found-merchants.component';

describe('NotFoundMerchantsComponent', () => {
  let component: NotFoundMerchantsComponent;
  let fixture: ComponentFixture<NotFoundMerchantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotFoundMerchantsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundMerchantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
