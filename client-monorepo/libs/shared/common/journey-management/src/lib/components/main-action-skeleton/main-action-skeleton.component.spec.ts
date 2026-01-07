import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MainActionSkeletonComponent } from "./main-action-skeleton.component";

describe("MainActionSkeletonComponent", () => {
  let component: MainActionSkeletonComponent;
  let fixture: ComponentFixture<MainActionSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainActionSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainActionSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
