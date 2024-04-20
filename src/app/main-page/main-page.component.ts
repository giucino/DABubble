import { Component } from '@angular/core';
import { ChannelComponent } from './channel/channel.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { MainHeaderComponent } from './main-header/main-header.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [ChannelComponent, MainMenuComponent, MainHeaderComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {}
