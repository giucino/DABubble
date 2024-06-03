import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  hideElement = false;
  constructor(
    private router: Router
  ) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideElement = this.router.url !== '/login-page/login';
      }
    });
  }
  goToSignin() {
    this.router.navigate(['/login-page/signin']);
  }
}
