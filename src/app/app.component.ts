import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { EmailSnackbarComponent } from './popups/email-snackbar/email-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAuthService } from './firebase.service/user.auth.service';
import { UserService } from './firebase.service/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DABubble';
  constructor(private router: Router, private _snackBar: MatSnackBar, public userAuth: UserAuthService, public userService: UserService) { }

  ngOnInit(): void {
    if (this.router.url.includes('/reset-password?mode=action&oobCode=code') || this.router.url.includes('/reset-password') ){
      return;
    }
    this.userAuth.checkAuth().then(isLoggedIn => {
      if (isLoggedIn) {
        // console.log('current user', this.userService.currentUser);
        // console.log('last channel', this.userService.currentUser.last_channel);
        // if (this.userService.currentUser.last_channel){
        //   this.router.navigate(['/main-page/' + this.userService.currentUser.last_channel]);
        // } else {
        this.router.navigate(['/main-page']);
        // }
      } else {
        this.router.navigate(['/login-page/login']);
      }
    });
  }

  confirmPopup(){
    this._snackBar.openFromComponent(EmailSnackbarComponent, {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      direction: 'rtl'
    });
  }
}
