import { Component, ElementRef, Renderer2, inject } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginPageComponent } from '../login-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Firestore, onSnapshot } from '@angular/fire/firestore';
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


  constructor(
    private router: Router, private userService: UserService, private route: ActivatedRoute) {

  }

  ngonInit() {
    this.getUser(this.userId);
    this.userId = this.route.snapshot.params['id'];
  }

  async getUser(userId: any) {
    return onSnapshot(this.userService.getSingleUserRef('users', userId), (doc) => {
      this.user = doc.data() as User;
    });
  }

  goToLogin() {
    this.router.navigate(['/login-page/login']);
  }

  goToAvatar() {
    // hier name email und password zu json speichern
    this.userService.addUser(this.user); //add geht
    setTimeout(() => {
      this.router.navigate(['/login-page/avatar/' + this.user.name]); //geht noch nicht
    }, 2000);

  }



}



