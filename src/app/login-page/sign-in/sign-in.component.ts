import { Component, ElementRef, Renderer2 } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router, RouterModule } from '@angular/router';
import { LoginPageComponent } from '../login-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';

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
  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef) { }

  goToLogin() {
    this.router.navigate(['/login-page/login']);
  }

  goToAvatar() {
    this.router.navigate(['/login-page/avatar']);
  }

  ngAfterViewInit() {
      const aElements = this.el.nativeElement.querySelectorAll('a');
  
      aElements.forEach((aElement: { parentElement: { previousElementSibling: any; }; }) => {
          this.renderer.listen(aElement, 'mouseover', () => {
              const inputElement = aElement.parentElement.previousElementSibling;
              if (inputElement && inputElement.type === 'checkbox') {
                  this.renderer.setStyle(inputElement, 'background-color', 'var(--color-bg)');
              }
          });
  
          this.renderer.listen(aElement, 'mouseout', () => {
              const inputElement = aElement.parentElement.previousElementSibling;
              if (inputElement && inputElement.type === 'checkbox') {
                  this.renderer.setStyle(inputElement, 'background-color', 'white');
              }
          });
      });
  }
}



