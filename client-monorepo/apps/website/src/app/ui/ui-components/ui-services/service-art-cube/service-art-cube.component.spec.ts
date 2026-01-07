import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceArtCubeComponent } from './service-art-cube.component';

describe('ServiceArtCubeComponent', () => {
  let component: ServiceArtCubeComponent;
  let fixture: ComponentFixture<ServiceArtCubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceArtCubeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceArtCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
