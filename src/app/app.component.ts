import { Component, HostListener } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { EmailSnackbarComponent } from './popups/email-snackbar/email-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAuthService } from './firebase.service/user.auth.service';
import { UserService } from './firebase.service/user.service';
import { user } from '@angular/fire/auth';
import { ChannelFirebaseService } from './firebase.service/channelFirebase.service';
import e from 'express';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DABubble';
  timeoutId: any;
  userId: any;
  constructor(private router: Router, private _snackBar: MatSnackBar, public userAuth: UserAuthService,
    public userService: UserService, public channelService: ChannelFirebaseService) {
    if (userService.currentUser) {
      this.userId = userService.currentUser.id;
    }
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event: Event) {
    this.userAuth.logout();
    this.userService.updateOnlineStatus(this.userId, false); // geht
  }

  ngOnInit(): void {
    
    this.userAuth.checkAuth().then(isLoggedIn => {
      if (isLoggedIn) {
        this.userService.getUsers();
        this.userService.getCurrentUser();
        setTimeout(() => {
          localStorage.setItem('currentUser', JSON.stringify(this.userService.currentUser));
        }, 500);
        if (this.userService.currentUser) {
          if (this.channelService.currentChannel.active_members.includes(this.userService.currentUser.id)) { // falls user in den channel  darf ändern
            this.router.navigate(['/main-page/' + this.userService.currentUser.last_channel]);
            
          } else { // for all channels includes user id show channel[0] irgendwie so
            this.router.navigate(['/main-page']);
          }
        }
        // }, 500);

      } if (!isLoggedIn) {
        if (this.router.url.includes('/reset-password?mode=action&oobCode=code') || this.router.url.includes('/reset-password')) {
          return;
        } else {
        this.userAuth.logout();
        this.router.navigate(['/login-page/login']);
        }
      }
    });


  }

  confirmPopup() {
    this._snackBar.openFromComponent(EmailSnackbarComponent, {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      direction: 'rtl'
    });
  }
}
