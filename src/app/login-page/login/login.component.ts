import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { Auth, GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect } from '@angular/fire/auth';
import { UserAuthService } from '../../firebase.service/user.auth.service';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from '../../firebase.service/user.service';
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
    
    // this.userAuth.currentUser();
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
        // console.log('current user', this.userService.currentUser);
      }, 1000);
    } catch (error) {
      console.error(error);
      this.error = true;
      // loading balken false
    }
  }


  // first channel in list openChannel that channel id
  loginWithGoogle() {
    this.userAuth.loginWithGoogle().then((result) => {
      let googleUserId = this.userService.allUsers.find(user => user.email === this.userAuth.googleEmail).id;
      const user = this.setGoogleUser();
      this.userService.getUsers();
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.userService.getCurrentUser(this.loginEmail);
      this.userService.addDatabaseIdToUser(googleUserId);
      if (this.userService.allUsers.some(user => user.email === this.userAuth.googleEmail)) {
        this.channelService.getChannelsForCurrentUser();
        setTimeout(() => {
          this.router.navigate(['/main-page']);
        }, 1000);
      } else {
        this.userService.addGoogleUser(user).then(() => {
          this.channelService.getChannelsForCurrentUser();
          setTimeout(() => {
            this.router.navigate(['/main-page']);
          }, 1000);
        });
      }}).catch((error) => {
      console.error(error);
    });
  }

  setGoogleUser() {
    let googleUserId = this.userService.allUsers.find(user => user.email === this.userAuth.googleEmail).id;
    return {
      name: this.userAuth.googleName,
      email: this.userAuth.googleEmail,
      profile_img: this.userAuth.googleProfileImg,
      id: googleUserId,
      last_channel: '',
      logged_in: true,
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
  }

  async loginAsGuest() {
    await this.userAuth.guestLogin();
    this.userService.getUsers();
    this.userService.getCurrentUser('guest');
    localStorage.setItem('currentUser', JSON.stringify(this.userService.currentUser));
    await this.channelService.getChannelsForCurrentUser();
    
    setTimeout(() => {
      this.userService.updateOnlineStatus(this.userService.currentUser.id, true);
    }, 500);
    setTimeout(() => {

      this.router.navigate(['/main-page']);
      // this.channelService.setCurrentChannel(this.channelService.channels[0].id);
      // this.router.navigate(['/main-page/', this.channelService.channels[0].id]);
    }, 1000);
  }



}
