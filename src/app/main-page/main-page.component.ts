import { Component } from '@angular/core';
import { ChannelComponent } from './channel/channel.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [ChannelComponent, MainMenuComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
