import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorsVsCopiersComponent } from './creators-vs-copiers.component';

describe('CreatorsVsCopiersComponent', () => {
  let component: CreatorsVsCopiersComponent;
  let fixture: ComponentFixture<CreatorsVsCopiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatorsVsCopiersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatorsVsCopiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
