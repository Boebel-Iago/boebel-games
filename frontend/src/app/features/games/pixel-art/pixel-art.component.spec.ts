import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixelArtComponent } from './pixel-art.component';

describe('PixelArtComponent', () => {
  let component: PixelArtComponent;
  let fixture: ComponentFixture<PixelArtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixelArtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PixelArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
