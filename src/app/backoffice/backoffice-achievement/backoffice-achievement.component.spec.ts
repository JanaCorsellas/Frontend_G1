import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeAchievementComponent } from './backofficeAchievements/backoffice-achievement.component';

describe('BackofficeAchievementComponent', () => {
  let component: BackofficeAchievementComponent;
  let fixture: ComponentFixture<BackofficeAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackofficeAchievementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackofficeAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
