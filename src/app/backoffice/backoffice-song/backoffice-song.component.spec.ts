import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeSongComponent } from './backoffice-song.component';

describe('BackofficeSongComponent', () => {
  let component: BackofficeSongComponent;
  let fixture: ComponentFixture<BackofficeSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackofficeSongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackofficeSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
