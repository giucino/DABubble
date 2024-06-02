import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CommonModule } from '@angular/common';
import { EmailSentComponent } from '../email-sent/email-sent.component';
import { UserAuthService } from '../firebase.service/user.auth.service';

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
  oobCode: string = '';

  constructor(private router: Router, private userAuth: UserAuthService, public route: ActivatedRoute) { 

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
    this.resetUser();
  }

  goToSignin() {
    this.router.navigate(['/login-page/signin']);
  }

  ngOnInit(): void {
    if(this.router.url.includes('/login-page/email-reset')){
      this.oobCode = this.route.snapshot.queryParams['oobCode'];
      console.log(this.oobCode);
        try{
          if (this.oobCode) {
          this.userAuth.handleActionCode(this.oobCode);
          }
        }
        catch(error){
          console.error('Error updating user', error);
        }
    } else {
    this.router.navigate(['login-page/login']);
    }
  }

  resetUser(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
    }
  }
}
