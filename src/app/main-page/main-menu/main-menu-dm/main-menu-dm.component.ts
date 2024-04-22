import { Component } from '@angular/core';
import { DynamicContentComponent } from '../../../shared/dynamic-content/dynamic-content.component';


@Component({
  selector: 'app-main-menu-dm',
  standalone: true,
  imports: [DynamicContentComponent],
  templateUrl: './main-menu-dm.component.html',
  styleUrl: './main-menu-dm.component.scss'
})
export class MainMenuDmComponent {

}
