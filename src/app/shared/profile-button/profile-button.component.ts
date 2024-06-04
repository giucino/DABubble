import { Component, Input } from '@angular/core';
import { OpenProfileDirective } from '../directives/open-profile.directive';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [OpenProfileDirective],
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss'
})
export class ProfileButtonComponent {

  @Input() userId: string = '';
  @Input() userName!: string;

}
