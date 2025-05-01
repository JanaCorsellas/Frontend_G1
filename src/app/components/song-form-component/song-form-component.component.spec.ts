import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongFormComponentComponent } from './song-form-component.component';

describe('SongFormComponentComponent', () => {
  let component: SongFormComponentComponent;
  let fixture: ComponentFixture<SongFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongFormComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
