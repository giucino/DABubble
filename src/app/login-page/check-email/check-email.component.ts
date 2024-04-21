import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarHorizontalPosition,
  MatSnackBarLabel,
  MatSnackBarModule,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { EmailSnackbarComponent } from '../../popups/email-snackbar/email-snackbar.component';
import { LoginPageComponent } from '../login-page.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-check-email',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './check-email.component.html',
  styleUrl: './check-email.component.scss'
})
export class CheckEmailComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  // direction: MatSnackBar 'rtl';
  constructor(private router: Router, private loginPage: AppComponent) { }

  goToLogin(){
    this.router.navigate(['/login-page/login']);
  }

  sendResetEmail(){
    // Send reset email logic here
    // this.confirmPopup();
    this.loginPage.confirmPopup();
    this.returnToResetPassword();
  }

  returnToResetPassword(){
    setTimeout(() => {
      this.router.navigate(['/login-page/reset-password']);
    }, 2000);
  }


  // confirmPopup(){
  //   this._snackBar.openFromComponent(EmailSnackbarComponent, {
  //     duration: 200000,
  //     horizontalPosition: 'right',
  //     verticalPosition: 'bottom',
  //     direction: 'rtl'
  //   });
  // }
  
}
