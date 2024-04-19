import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuHeaderComponent } from './main-menu-header.component';

describe('MainMenuHeaderComponent', () => {
  let component: MainMenuHeaderComponent;
  let fixture: ComponentFixture<MainMenuHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainMenuHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainMenuHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
