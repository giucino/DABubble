import { Component, ElementRef, Renderer2 } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router, RouterModule } from '@angular/router';
import { LoginPageComponent } from '../login-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [LoginComponent, RouterModule, LoginPageComponent, CommonModule, FormsModule, MatCheckboxModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  checked = false;
  disabled = false;
  hoverState = false;
  constructor(private router: Router) { }

  goToLogin() {
    this.router.navigate(['/login-page/login']);
  }

  goToAvatar() {
    this.router.navigate(['/login-page/avatar']);
  }

}



