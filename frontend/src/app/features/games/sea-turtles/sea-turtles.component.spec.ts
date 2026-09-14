import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeaTurtlesComponent } from './sea-turtles.component';

describe('SeaTurtlesComponent', () => {
  let component: SeaTurtlesComponent;
  let fixture: ComponentFixture<SeaTurtlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeaTurtlesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeaTurtlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
