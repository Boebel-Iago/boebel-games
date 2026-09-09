import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserSearchComponent } from './browser-search.component';

describe('BrowserSearchComponent', () => {
  let component: BrowserSearchComponent;
  let fixture: ComponentFixture<BrowserSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrowserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
