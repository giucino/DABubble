import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCreatedSnackbarComponent } from '../../popups/user-created-snackbar/user-created-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../firebase.service/user.service';
import { onSnapshot } from '@angular/fire/firestore';
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
  // newUser: string | any;
  userId: string | any;
  user: User = new User();
  currentUser: any;
  currentUserId: string | any;

  constructor(private router: Router, private _snackBar: MatSnackBar, private route: ActivatedRoute, 
    private userService: UserService) { 
      const navigation = this.router.getCurrentNavigation();
      this.currentUser = navigation?.extras.state?.['user'];
      // console.log(JSON.stringify(this.currentUser, null, 2)); // endlich
    }


  ngonInit() {
    this.userService.getUsers();
    
    // this.newUser = this.userService.allUsers[this.userService.allUsers.length - 1];
    // this.userId = this.route.snapshot.params['id'];
    // this.getUser(this.userId);
    // console.log('aus avatar component :' + this.userId);
    // this.userService.loadUser(this.userId);
  }

  // async getUser(userId: any) {
  //   return onSnapshot(this.userService.getSingleUserRef(userId), (doc) => {
  //     this.user = doc.data() as User;
  //     console.log(this.user);
  //   });
  // }

  goToSignIn(){
    // delte user from db
    this.findCurrentUserId();
    this.userService.deleteUser(this.currentUserId);
    this.router.navigate(['/login-page/signin']);
  }

  goToLogin(){
    setTimeout(() => {
      this.router.navigate(['/login-page/login']);
    }, 5000);
  }

  async uploadAvatar(event: any) {
    const file = event.target.files[0];
    const imageUrl = await this.userService.uploadImage(file);
    this.selectedAvatar = imageUrl;
    console.log('Avatar uploaded');
    this.uploadedAvatar = this.selectedAvatar;
    this.imageChanged = true;
  }

  changeAvatar(i:number){
    this.selectedAvatar = this.avatars[i];
    this.imageChanged = true;
  }

  findCurrentUserId(): void {
    for (let user of this.userService.allUsers) {
      if (user.data.email === this.currentUser.email) {
        this.currentUserId = user.id;
        // console.log('currentUserId: ' + this.currentUserId);
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
    // save this.selectedAvatar to user singleuserRef
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
