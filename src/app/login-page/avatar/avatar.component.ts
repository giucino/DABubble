import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserCreatedSnackbarComponent } from '../../popups/user-created-snackbar/user-created-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  avatars = [
    'assets/img/person.png',
    'assets/img/avatar-1.jpg',
    'assets/img/avatar-2.jpg',
    'assets/img/avatar-3.jpg',
    'assets/img/avatar-4.jpg',
    'assets/img/avatar-5.jpg',
    'assets/img/avatar-6.jpg',
  ];
  selectedAvatar = this.avatars[0];
  uploadedAvatar = '';

  constructor(private router: Router, private _snackBar: MatSnackBar) { }

  goToSignIn(){
    this.router.navigate(['/login-page/sigin']);
  }

  goToLogin(){
    setTimeout(() => {
      this.router.navigate(['/login-page/login']);
      // window.location.reload();
    }, 5000);
  }

  uploadAvatar(){
    // open picture upload dialog?
    console.log('Avatar uploaded');
    this.uploadedAvatar = this.selectedAvatar
  }

  changeAvatar(i:number){
    this.selectedAvatar = this.avatars[i];
  }

  createUser(){
    // save this.selectedAvatar to user singeuserRef
    this.confirmPopup();
    this.triggerAnimation();
    this.goToLogin();
  }

  triggerAnimation() {
    const element = document.querySelector('.cdk-overlay-container');
    if (element) {
      element.classList.add('animate');
  
      setTimeout(() => {
        element.classList.remove('animate');
      }, 2000);
    }
  }

  confirmPopup(){
    this._snackBar.openFromComponent(UserCreatedSnackbarComponent, {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      direction: 'rtl'
    });
  }
}
