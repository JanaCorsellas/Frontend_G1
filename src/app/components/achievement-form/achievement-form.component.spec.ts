import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementFormComponent } from './achievement-form.component';

describe('AchievementCreateComponent', () => {
  let component: AchievementFormComponent;
  let fixture: ComponentFixture<AchievementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
