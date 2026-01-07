import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTheCompanyComponent } from './about-the-company.component';

describe('AboutTheCompanyComponent', () => {
  let component: AboutTheCompanyComponent;
  let fixture: ComponentFixture<AboutTheCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutTheCompanyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutTheCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
