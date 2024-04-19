import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuChannelsComponent } from './main-menu-channels.component';

describe('MainMenuChannelsComponent', () => {
  let component: MainMenuChannelsComponent;
  let fixture: ComponentFixture<MainMenuChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainMenuChannelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainMenuChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
