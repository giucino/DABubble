import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { Auth, GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect } from '@angular/fire/auth';
import { UserAuthService } from '../../firebase.service/user.auth.service';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from '../../firebase.service/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule, ResetPasswordComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  firestore: Firestore = inject(Firestore);
  email: string = '';
  password: string = '';
  error = false;
  loginEmail: string = '';
  loginPassword: string = '';

  constructor(private userAuth: UserAuthService, private userService: UserService, private router: Router) { }

  ngonInit() {
    this.error = false;
  }
    
    async login() {
      const email = this.loginEmail;
      const password = this.loginPassword;
      // loading balken true 
    try {
      await this.userAuth.loginUser(email, password);
      await this.userService.getUsers();
      this.router.navigate(['/main-page']);
      console.log('logged on as: ', );
    } catch (error) {
      console.error(error);
      this.error = true;
      // loading balken false
    }
  }

  loginWithGoogle() {
    this.userAuth.loginWithGoogle().then((result) => {
      this.router.navigate(['/main-page']);
      // Handle the login result here
    }).catch((error) => {
      // Handle the error here
      console.error(error);
    });

    // user logged in weierleiten
  }

  loginAsGuest() {
    this.userAuth.guestLogin().then(() => {
      this.router.navigate(['/main-page']);
    });
  }

}
