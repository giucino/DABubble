import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { Auth, GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect } from '@angular/fire/auth';
import { UserAuthService } from '../../firebase.service/user.auth.service';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from '../../firebase.service/user.service';
import { last } from 'rxjs';
import { log } from 'console';
import { User } from '../../models/user';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule, ResetPasswordComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  firestore: Firestore = inject(Firestore);
  error = false;
  loginEmail: string = '';
  loginPassword: string = '';

  constructor(private userAuth: UserAuthService, private userService: UserService, 
    private router: Router, private channelService: ChannelFirebaseService) { }

  ngonInit() {
    this.error = false;
  }

  async login() {
    const email = this.loginEmail;
    const password = this.loginPassword;
    // loading balken true 
    try {
      await this.userAuth.loginUser(email, password);
      this.userService.getUsers();

      this.userService.getCurrentUser(this.loginEmail); // currentUser is set
      localStorage.setItem('currentUser', JSON.stringify(this.userService.currentUser)); // to stay logged in after reload/refresh
      this.userService.updateOnlineStatus(this.userService.currentUser.id, true);
      this.channelService.getChannelsForCurrentUser()
      setTimeout(() => {
        this.router.navigate(['/main-page']);
      }, 2000);
    } catch (error) {
      console.error(error);
      this.error = true;
      // loading balken false
    }
  }

  loginWithGoogle() {
    this.userAuth.loginWithGoogle().then((result) => {
      let googleUserId = this.userService.allUsers.find(user => user.email === this.userAuth.googleEmail).id;
      const user = {
        name: this.userAuth.googleName,
        email: this.userAuth.googleEmail,
        profile_img: this.userAuth.googleProfileImg,
        id: googleUserId,
        last_channel: '',
        logged_in: false,
        is_typing: false,
        password: '',
        toJSON() {
          return {
            name: this.name,
            email: this.email,
            profile_img: this.profile_img,
            id: this.id,
            last_channel: this.last_channel,
            logged_in: this.logged_in,
            is_typing: this.is_typing,
            password: this.password
          };
        }
      };
      this.userService.getUsers();
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.userService.getCurrentUser(this.loginEmail);
      this.userService.addDatabaseIdToUser(googleUserId);

      if (this.userService.allUsers.some(user => user.email === this.userAuth.googleEmail)) {
        this.channelService.getChannelsForCurrentUser();
        setTimeout(() => {
          this.router.navigate(['/main-page']);
        }, 2000);
        
      } else {
        this.userService.addGoogleUser(user).then(() => {
          this.channelService.getChannelsForCurrentUser();
          setTimeout(() => {
            this.router.navigate(['/main-page']);
            
          }, 2000);
          
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  loginAsGuest() {
    this.userAuth.guestLogin().then(() => {
      this.userService.getUsers();
      this.userService.getCurrentUser('guest');
      this.channelService.getChannelsForCurrentUser();
      setTimeout(() => {
        this.router.navigate(['/main-page']);
        
      }, 2000);
    });
  }



}
