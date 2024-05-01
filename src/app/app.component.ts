import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { EmailSnackbarComponent } from './popups/email-snackbar/email-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAuthService } from './firebase.service/user.auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DABubble';
  constructor(private router: Router, private _snackBar: MatSnackBar, public userAuth: UserAuthService) { }

  ngOnInit(): void {
    if (this.router.url === '/main-page') {  //damit man nicht über url auf die main kommt, if user logged in
      this.router.navigate(['/login-page']);
    }
     if (this.router.url === '/reset-password') { //für den reset link
      this.router.navigate(['/reset-password']);
    }
    if (this.router.url === '') {
      this.router.navigate(['/login-page']); // ansonsten immer auf login page
    } 
    // this.router.navigate(['/login-page']);
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
