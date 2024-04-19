import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuDmComponent } from './main-menu-dm.component';

describe('MainMenuDmComponent', () => {
  let component: MainMenuDmComponent;
  let fixture: ComponentFixture<MainMenuDmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainMenuDmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainMenuDmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
