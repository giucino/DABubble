import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CommonModule } from '@angular/common';
import { EmailSentComponent } from '../email-sent/email-sent.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule, LoginComponent, SignInComponent, ResetPasswordComponent,
     AvatarComponent, EmailSentComponent, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  hideElement = false;
  hideExtras = false;
  constructor(private router: Router) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideElement = this.router.url !== '/login-page/login';
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideExtras = this.router.url == '/login-page/imprint' || this.router.url == '/login-page/privacy-policy';
      }
    });
  }

  goToSignin() {
    this.router.navigate(['/login-page/signin']);
  }

  ngOnInit(): void {
    this.router.navigate(['login-page/login']);
  }
}
