import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { LoginSnackbarComponent } from '../../popups/login-snackbar/login-snackbar.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  constructor(private router: Router, private _snackBar: MatSnackBar) { }

  goToCheckEmail(){
    this.router.navigate(['/login-page/check-email']);
  }
  returnToLogin(){
    setTimeout(() => {
      this.router.navigate(['/login-page/login']);
    }, 2000);
  }

  confirmPopup(){
    this._snackBar.openFromComponent(LoginSnackbarComponent, {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      direction: 'rtl'
    });
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

  changePassword(){
    // Change password logic here
    // rgba background 
    this.confirmPopup();
    this.returnToLogin();
    this.triggerAnimation();
  }
}
