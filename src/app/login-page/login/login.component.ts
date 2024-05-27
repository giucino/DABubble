import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { UserAuthService } from '../../firebase.service/user.auth.service';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from '../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule, ResetPasswordComponent,
    MatProgressBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  firestore: Firestore = inject(Firestore);
  error = false;
  loginEmail: string = '';
  loginPassword: string = '';
  isLoading = false;
  iconSrc = '/assets/img/mail.png'

  constructor(private userAuth: UserAuthService, private userService: UserService, 
    private router: Router, private channelService: ChannelFirebaseService) { }

  ngonInit() {
    this.error = false;
  }

  async login() {
    const email = this.loginEmail;
    const password = this.loginPassword;
    // loading balken true 
    this.isLoading = true;
    this.userAuth.loginUser(email, password)
    .then(() => {
      return Promise.all([
        this.error = false,
        this.userService.getUsers(),
        this.userService.getCurrentUser(this.loginEmail),
        this.channelService.getChannelsForCurrentUser()
      ]);
    })
    .then(() => {
      this.error = false;
      this.userService.updateOnlineStatus(this.userService.currentUser.id, true);
      localStorage.setItem('currentUser', JSON.stringify(this.userService.currentUser)); // to stay logged in after reload/refresh
      this.isLoading = false;
      this.router.navigate(['/main-page']);
    })
    .catch((error) => {
      console.error(error);
      this.error = true;
      this.isLoading = false;
      // loading balken false
    });

    // try {
    //   await this.userAuth.loginUser(email, password);
    //   this.userService.getUsers();

    //   this.userService.getCurrentUser(this.loginEmail); // currentUser is set
    //   this.userService.updateOnlineStatus(this.userService.currentUser.id, true);
    //   localStorage.setItem('currentUser', JSON.stringify(this.userService.currentUser)); // to stay logged in after reload/refresh
    //   // this.userService.updateOnlineStatus(this.userService.currentUser.id, true);
    //   this.channelService.getChannelsForCurrentUser()
    //   setTimeout(() => {
    //     this.router.navigate(['/main-page']);
    //   }, 1000);
    // } catch (error) {
    //   console.error(error);
    //   this.error = true;
    //   // loading balken false
    // }
  }


  // first channel in list openChannel that channel id
  async loginWithGoogle() {
    try {
      await this.userAuth.loginWithGoogle();
      this.isLoading = true;
      let user = this.setGoogleUser();
      let googleUserId = this.userService.allUsers.find(user => user.email === this.userAuth.googleEmail)?.id;
  
      if (googleUserId) {
        // User exists, login with that user
        await Promise.all([
          this.userService.getUsers(),
          this.userService.getCurrentUser(this.userAuth.googleEmail),
          this.channelService.getChannelsForCurrentUser(),
          this.userService.updateOnlineStatus(googleUserId, true)
        ]);
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        // User does not exist, add Google user
        await this.userService.addUser(user);
        await Promise.all([
          this.userService.getUsers(),
          this.userService.getCurrentUser(this.userAuth.googleEmail),
          this.channelService.getChannelsForCurrentUser(),
          this.userService.updateOnlineStatus(this.userService.currentUser.id, true)
        ]);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      //then goes to main-page
      this.isLoading = false;
      this.router.navigate(['/main-page/']);
    } catch (error) {
      console.error(error);
    }

    // this.userAuth.loginWithGoogle().then((result) => {
    //   let googleUserId = this.userService.allUsers.find(user => user.email === this.userAuth.googleEmail).id;

    //   const user = this.setGoogleUser();
    //   this.userService.getUsers();
    //   this.userService.getCurrentUser(this.loginEmail);
    //   this.userService.updateOnlineStatus(this.userService.currentUser.id, true);
    //   this.userService.addDatabaseIdToUser(googleUserId);
    //   if (this.userService.allUsers.some(user => user.email === this.userAuth.googleEmail)) {
    //     this.channelService.getChannelsForCurrentUser();
    //     localStorage.setItem('currentUser', JSON.stringify(user)); 
    //     setTimeout(() => {
    //       this.router.navigate(['/main-page/']);
    //     }, 1000);
    //   } else {
    //     this.userService.addGoogleUser(user).then(() => {
    //       localStorage.setItem('currentUser', JSON.stringify(user));
    //       this.channelService.getChannelsForCurrentUser();
    //       setTimeout(() => {
    //         this.router.navigate(['/main-page/']);
    //       }, 1000);
    //     });
    //   }}).catch((error) => {
    //   console.error(error);
    // });
  }

  setGoogleUser() {
    let user = this.userService.allUsers.find(user => user.email === this.userAuth.googleEmail);
    // let googleUserId = this.userService.allUsers.find(user => user.email === this.userAuth.googleEmail).id;
    // let last_ch = this.userService.allUsers.find(user => user.email === this.userAuth.googleEmail).last_channel;
    // let last_th = this.userService.allUsers.find(user => user.email === this.userAuth.googleEmail).last_thread;
    return {
      name: this.userAuth.googleName,
      email: this.userAuth.googleEmail,
      profile_img: this.userAuth.googleProfileImg,
      id: user.id,
      last_channel: user.last_channel || '',
      last_thread: user.last_thread || '',
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
          last_thread: this.last_thread,
          logged_in: this.logged_in,
          is_typing: this.is_typing,
          password: this.password
        };
      }
    };
  }

  async loginAsGuest() {
    this.isLoading = true;
    try {
      await this.userAuth.guestLogin();
      await Promise.all([
        this.userService.getUsers(),
        this.userService.getCurrentUser('guest'),
        this.channelService.getChannelsForCurrentUser(),
        localStorage.setItem('currentUser', JSON.stringify(this.userService.currentUser)),
      this.userService.updateOnlineStatus(this.userService.currentUser.id, true)
      ]);
      //then
      this.isLoading = false;
      this.router.navigate(['/main-page']);
    } catch (error) {
      console.error(error);
      this.error = true;
    }

    // await this.userAuth.guestLogin();
    // this.userService.getUsers();
    // this.userService.getCurrentUser('guest');
    // localStorage.setItem('currentUser', JSON.stringify(this.userService.currentUser));
    // await this.channelService.getChannelsForCurrentUser();
    
    // setTimeout(() => {
    //   this.userService.updateOnlineStatus(this.userService.currentUser.id, true);
    // }, 500);
    // setTimeout(() => {

    //   this.router.navigate(['/main-page']);
    // }, 1000);
  }

  changeIcon(focus: boolean) {
    this.iconSrc = focus ? '/assets/img/mail_b.png' : '/assets/img/mail.png';
  }

}
