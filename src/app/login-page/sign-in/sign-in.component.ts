import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router, RouterModule } from '@angular/router';
import { LoginPageComponent } from '../login-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [LoginComponent, RouterModule, LoginPageComponent, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  
  constructor(private router: Router) { }

  goToLogin() {
    this.router.navigate(['/login']);
   
  }
}
