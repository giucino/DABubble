import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSnackbarComponent } from './login-snackbar.component';

describe('LoginSnackbarComponent', () => {
  let component: LoginSnackbarComponent;
  let fixture: ComponentFixture<LoginSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSnackbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
