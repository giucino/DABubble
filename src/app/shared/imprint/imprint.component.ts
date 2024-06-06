import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

  constructor(private router: Router) { }

  
  goBack(){
    this.router.navigate(['/login-page/login']);
  }
}
