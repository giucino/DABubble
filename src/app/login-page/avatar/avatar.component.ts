import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  goToSignIn(){
    this.router.navigate(['/login-page/sigin']);
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

    setTimeout(() => {
      this.router.navigate(['/login-page/login']);
      // window.location.reload();
    }, 5000);
    
  }
}
