import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { LoginSnackbarComponent } from '../../popups/login-snackbar/login-snackbar.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../firebase.service/user.service';
import { UserAuthService } from '../../firebase.service/user.auth.service';
import { getAuth } from '@angular/fire/auth';

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
  oobCode: string = '';
  constructor(private router: Router, private _snackBar: MatSnackBar,
     private userAuth: UserAuthService, private route: ActivatedRoute) { }


ngonInit(): void {
  // console.log(this.userAuth.displayName);
  // this.oobCode = this.route.snapshot.queryParams['oobCode'];
  // this.changePassword('newPassword', oobCode);
}

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

  updateUserPassword(newPassword: string){
    this.oobCode = this.route.snapshot.queryParams['oobCode'];
    this.userAuth.changePassword(newPassword, this.oobCode);
  }

  changePassword(newPassword: string){
    Promise.resolve(this.updateUserPassword(newPassword)).then(() => {
      this.confirmPopup();
      this.returnToLogin();
      this.triggerAnimation();
    }).catch((error) => {
      console.error(error);
    });

  }
}
