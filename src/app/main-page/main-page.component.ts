import { Component } from '@angular/core';
import { ChannelComponent } from './channel/channel.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { ChannelFirebaseService } from '../firebase.service/channelFirebase.service';
import { UserService } from '../firebase.service/user.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [ChannelComponent, MainMenuComponent, MainHeaderComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})

export class MainPageComponent {
  

  constructor(public userService: UserService, public channelService: ChannelFirebaseService) {
    // this.channelService.getChannelsForCurrentUser(this.userService.currentUser.id);
    if (this.userService.currentUser) {
      this.channelService.getChannelsForCurrentUser(this.userService.currentUser.id);
    }

  }


  threadClosed: boolean = false;



  isThreadClosed(value: boolean) {
    this.threadClosed = value;
  }
}

