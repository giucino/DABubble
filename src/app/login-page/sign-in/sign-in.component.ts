import { Component, ViewChild, ElementRef, Renderer2, inject, viewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginPageComponent } from '../login-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Firestore, onSnapshot, doc } from '@angular/fire/firestore';
import { UserService } from '../../firebase.service/user.service';
import { User } from '../../models/user';
import { UserAuthService } from '../../firebase.service/user.auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [LoginComponent, RouterModule, LoginPageComponent, CommonModule, FormsModule, MatCheckboxModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})

export class SignInComponent {
  checkbox = {checked: false};
  checked = false;
  disabled = false;
  hoverState = false;
  firestore: Firestore = inject(Firestore);
  user = new User();
  emailExists: boolean = false;
  // userId: string | any;

  constructor(
    private router: Router, private userService: UserService, 
    private route: ActivatedRoute, private userAuth: UserAuthService) {

  }

  ngonInit() {
    this.userService.getUsers();

  }

  // async getUser(userId: any) {
  //   return onSnapshot(this.userService.getSingleUserRef(userId), (doc) => {
  //     this.user = doc.data() as User;
  //     this.userId = doc.id;
  //   });
  // }

  goToLogin() {
    this.router.navigate(['/login-page/login']);
  }

  checkEmail() {
    const userExists = this.userService.allUsers.some(user => user.data.email === this.user.email);
    if (userExists) {
      console.log('User already exists');
      this.emailExists = true;
    }
    return userExists;
  }

  async goToAvatar() {
    if (this.checkEmail()) {return;}
    
    await this.userAuth.registerUser(this.user.email, this.user.password).then(async () => {
      await this.userService.addUser(this.user);
    await this.userAuth.saveUser(this.user.name)}).then(() => {
      this.router.navigate(['/login-page/avatar'], { state: { user: this.user } });
    });
    // setTimeout(() => {
      //ladebalken maybe
      // this.router.navigate(['/login-page/avatar'], { state: { user: this.user } });
    // }, 2000);
    


  }



}



