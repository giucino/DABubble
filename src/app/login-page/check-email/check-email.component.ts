import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar,MatSnackBarModule} from '@angular/material/snack-bar';
import { EmailSnackbarComponent } from '../../popups/email-snackbar/email-snackbar.component';

@Component({
  selector: 'app-check-email',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './check-email.component.html',
  styleUrl: './check-email.component.scss'
})
export class CheckEmailComponent {
  constructor(private router: Router, private _snackBar: MatSnackBar) { }

  goToLogin(){
    this.router.navigate(['/login-page/login']);
  }

  sendResetEmail(){
    // Send reset email logic here
    this.confirmPopup();
    this.returnToResetPassword();
    this.triggerAnimation();
  }

  returnToResetPassword(){
    setTimeout(() => {
      this.router.navigate(['/login-page/reset-password']);
    }, 2000);
  }

  triggerAnimation() {
    const element = document.querySelector('.cdk-overlay-container');
    if (element) {
      element.classList.add('animate');
  
      setTimeout(() => {
        element.classList.remove('animate');
      }, 2000);
    }
  }

  confirmPopup(){
    this._snackBar.openFromComponent(EmailSnackbarComponent, {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      direction: 'rtl'
    });
  }
  
}
