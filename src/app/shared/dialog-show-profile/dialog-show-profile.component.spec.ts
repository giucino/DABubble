import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowProfileComponent } from './dialog-show-profile.component';

describe('DialogShowProfileComponent', () => {
  let component: DialogShowProfileComponent;
  let fixture: ComponentFixture<DialogShowProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogShowProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogShowProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
