import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCreatedSnackbarComponent } from '../../popups/user-created-snackbar/user-created-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../firebase.service/user.service';
import { User } from '../../models/user';

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
  imageChanged: boolean = false;
  userId: string | any;
  user: User = new User();
  currentUser: any;
  currentUserId: string | any;

  constructor(private router: Router, private _snackBar: MatSnackBar, private route: ActivatedRoute, 
    private userService: UserService) { 
      const navigation = this.router.getCurrentNavigation();
      this.currentUser = navigation?.extras.state?.['user'];
    }


  ngonInit() {
    this.userService.getUsers();
  }


  goToSignIn(){
    this.findCurrentUserId();
    this.userService.deleteUser(this.currentUserId);
    this.router.navigate(['/login-page/signin']);
  }


  goToLogin(){
    setTimeout(() => {
      this.router.navigate(['/login-page/login']);
    }, 2000);
  }


  async uploadAvatar(event: any) {
    const file = event.target.files[0];
    const imageUrl = await this.userService.uploadImage(file);
    this.selectedAvatar = imageUrl;
    this.uploadedAvatar = this.selectedAvatar;
    this.imageChanged = true;
  }


  changeAvatar(i:number){
    this.selectedAvatar = this.avatars[i];
    this.imageChanged = true;
  }


  findCurrentUserId(): void {
    for (let user of this.userService.allUsers) {
      if (user.email === this.currentUser.email) {
        this.currentUserId = user.id;
        this.userService.addDatabaseIdToUser(this.currentUserId);
        break;
        
      }
    }
  }


  setAvatarToUser(){
    this.findCurrentUserId();
    this.user.profile_img = this.selectedAvatar;
    this.userService.addAvatarToUser(this.currentUserId, this.selectedAvatar);
  }


  createUser(){
    this.setAvatarToUser();
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
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      direction: 'rtl',
    });
  }
}
