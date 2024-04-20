import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-email.component.html',
  styleUrl: './check-email.component.scss'
})
export class CheckEmailComponent {
  constructor(private router: Router) { }

  goToLogin(){
    this.router.navigate(['/login-page/login']);
  }

  sendResetEmail(){
    // Send reset email logic here

    setTimeout(() => {
      this.router.navigate(['/login-page/reset-password']);
    }, 2000);
  }
  
}
