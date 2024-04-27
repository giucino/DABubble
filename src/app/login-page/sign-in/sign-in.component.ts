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

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [LoginComponent, RouterModule, LoginPageComponent, CommonModule, FormsModule, MatCheckboxModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})

export class SignInComponent {
  checked = false;
  disabled = false;
  hoverState = false;
  firestore: Firestore = inject(Firestore);
  user = new User();
  userId: string | any;
  signEmail: string | any;
  // user.email: string | any;
  currentUserId: string | any;
  // @ViewChild('signEmail') signEmail: ElementRef | undefined;

  constructor(
    private router: Router, private userService: UserService, private route: ActivatedRoute) {

  }

  ngonInit() {
    // this.userId = this.route.snapshot.params['id'];
    // this.getUser(this.userId);
    // console.log(this.userId);
    this.userService.getUsers();
  }

  async getUser(userId: any) {
    return onSnapshot(this.userService.getSingleUserRef('users', userId), (doc) => {
      this.user = doc.data() as User;
      // this.userId = doc.id;
    });
  }

  goToLogin() {
    this.router.navigate(['/login-page/login']);
  }

  async getUserId(){
    // let email = this.signEmail?.nativeElement?.value;
    // let user = this.userService.allUsers.find(user => user.email === email);
    this.signEmail = this.user.email;
    let currentUser = this.userService.allUsers.find(user => user.email === this.signEmail);
    this.currentUserId = currentUser ? currentUser.id : null;
    return this.currentUserId;
  }

  async goToAvatar() {
    // hier name email und password zu json speichern
    await this.userService.addUser(this.user); //add geht
    let test = this.userService.allUsers;
    // this.getCurrentUser();
    console.log(test);
    // console.log(this.user);
    // this.userId = this.user.id;
    // this.userId = this.userService.getUserRef().doc().id;
    this.userService.getUsers();
    // let userId = await this.getUserId();
    // setTimeout(() => {
    //   this.getUserId();
    // }, 1500);
    setTimeout(() => {
      // this.getCurrentUser();
      this.router.navigate(['/login-page/avatar/' + this.user.name]); //geht noch nicht
    }, 2000);

  }



}



