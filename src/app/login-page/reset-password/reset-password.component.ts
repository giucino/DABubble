import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { LoginSnackbarComponent } from '../../popups/login-snackbar/login-snackbar.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../firebase.service/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  userId: string | any;
  resetPassword: string = '';
  resetPasswordAgain: string = '';
  constructor(private router: Router, private _snackBar: MatSnackBar, private userService: UserService) { }

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
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      direction: 'rtl',
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

  updateUserPassword(){
    // get user id from link? email?
    this.userId = '';
    this.userService.updatePassword(this.userId, this.resetPasswordAgain);
  }

  changePassword(){
    this.updateUserPassword();
    this.confirmPopup();
    this.returnToLogin();
    this.triggerAnimation();
  }
}
