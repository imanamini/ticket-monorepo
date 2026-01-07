import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsTraitComponent } from './about-us-trait.component';

describe('AboutUsTraitComponent', () => {
  let component: AboutUsTraitComponent;
  let fixture: ComponentFixture<AboutUsTraitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutUsTraitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsTraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
