import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyEscapeComponent } from './emergency-escape.component';

describe('EmergencyEscapeComponent', () => {
  let component: EmergencyEscapeComponent;
  let fixture: ComponentFixture<EmergencyEscapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyEscapeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmergencyEscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
