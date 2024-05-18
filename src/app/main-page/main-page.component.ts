import { Component } from '@angular/core';
import { ChannelComponent } from './channel/channel.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { ChannelFirebaseService } from '../firebase.service/channelFirebase.service';
import { UserService } from '../firebase.service/user.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThreadComponent } from './thread/thread.component';
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [ChannelComponent, MainMenuComponent, MainHeaderComponent, RouterModule, CommonModule, ThreadComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})

export class MainPageComponent {

  constructor(public userService: UserService, public channelService: ChannelFirebaseService, public threadService : ThreadService) {
    if (this.userService.currentUser) this.channelService.getChannelsForCurrentUser();
    if (this.userService.currentUser.last_thread && this.userService.currentUser.last_thread != '') {
      this.threadService.threadOpen = true;
    }

  }
}

