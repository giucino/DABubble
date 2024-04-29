import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { EmailSnackbarComponent } from './popups/email-snackbar/email-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DABubble';
  constructor(private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.router.url === '/main-page') {
      this.router.navigate(['/login-page']);
    }
     if (this.router.url === '/reset-password') {
      this.router.navigate(['/reset-password']);
    }
    if (this.router.url === '') {
      this.router.navigate(['/login-page']);
    } 
    // this.router.navigate(['/login-page']);
  }

  confirmPopup(){
    this._snackBar.openFromComponent(EmailSnackbarComponent, {
      duration: 200000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      direction: 'rtl'
    });
  }
}
