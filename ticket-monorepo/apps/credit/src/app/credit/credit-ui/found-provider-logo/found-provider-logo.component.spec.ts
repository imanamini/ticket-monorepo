import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundProviderLogoComponent } from './found-provider-logo.component';

describe('FoundProviderLogoComponent', () => {
  let component: FoundProviderLogoComponent;
  let fixture: ComponentFixture<FoundProviderLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoundProviderLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundProviderLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
