import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreatedSnackbarComponent } from './user-created-snackbar.component';

describe('UserCreatedSnackbarComponent', () => {
  let component: UserCreatedSnackbarComponent;
  let fixture: ComponentFixture<UserCreatedSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreatedSnackbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserCreatedSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
