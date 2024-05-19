import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddMemberMobileComponent } from './dialog-add-member-mobile.component';

describe('DialogAddMemberMobileComponent', () => {
  let component: DialogAddMemberMobileComponent;
  let fixture: ComponentFixture<DialogAddMemberMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddMemberMobileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddMemberMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
