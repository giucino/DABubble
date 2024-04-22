import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSnackbarComponent } from './email-snackbar.component';

describe('EmailSnackbarComponent', () => {
  let component: EmailSnackbarComponent;
  let fixture: ComponentFixture<EmailSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailSnackbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
