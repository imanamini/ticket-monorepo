import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginActivitiesComponent } from './user-login-activities.component';

describe('UserLoginActivitiesComponent', () => {
  let component: UserLoginActivitiesComponent;
  let fixture: ComponentFixture<UserLoginActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLoginActivitiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserLoginActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
