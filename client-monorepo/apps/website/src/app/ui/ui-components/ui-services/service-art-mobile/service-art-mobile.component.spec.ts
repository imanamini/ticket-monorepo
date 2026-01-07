import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceArtMobileComponent } from './service-art-mobile.component';

describe('ServiceArtMobileComponent', () => {
  let component: ServiceArtMobileComponent;
  let fixture: ComponentFixture<ServiceArtMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceArtMobileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceArtMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
