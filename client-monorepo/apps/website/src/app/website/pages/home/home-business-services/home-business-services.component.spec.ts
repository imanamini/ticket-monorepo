import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBusinessServicesComponent } from './home-business-services.component';

describe('HomeBusinessServicesComponent', () => {
  let component: HomeBusinessServicesComponent;
  let fixture: ComponentFixture<HomeBusinessServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeBusinessServicesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBusinessServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
