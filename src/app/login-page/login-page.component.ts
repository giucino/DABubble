import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AvatarComponent } from './avatar/avatar.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule, LoginComponent, SignInComponent, ResetPasswordComponent,
     AvatarComponent, SendEmailComponent, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  hideElement = false;
  constructor(private router: Router) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideElement = this.router.url !== '/login';
      }
    });
  }

  goToSignin() {
    this.router.navigate(['/signin']);
  }

  ngOnInit(): void {
    this.router.navigate(['/login']);
  }
  
  // goToImprint() {
  //   this.router.navigate(['/imprint']);
  // }

  // goToPrivacy() {
  //   this.router.navigate(['/privacy']);
  // }
}
