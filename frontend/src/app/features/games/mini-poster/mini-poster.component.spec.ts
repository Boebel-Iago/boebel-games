import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniPosterComponent } from './mini-poster.component';

describe('MiniPosterComponent', () => {
  let component: MiniPosterComponent;
  let fixture: ComponentFixture<MiniPosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniPosterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiniPosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
