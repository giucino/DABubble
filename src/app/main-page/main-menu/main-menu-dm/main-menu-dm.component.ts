import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../firebase.service/user.service';
import { User } from '../../../interfaces/user.interface';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';

@Component({
  selector: 'app-main-menu-dm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-menu-dm.component.html',
  styleUrl: './main-menu-dm.component.scss',
})
export class MainMenuDmComponent implements OnInit, OnDestroy {
  isExpanded = true;

  users: User[] = [];

  constructor(public userService: UserService, public channelService : ChannelFirebaseService) {}

  ngOnInit(): void {
    this.users = this.userService.allUsers; 
  }
  
  ngOnDestroy(): void {}

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }

  openDirectChannel( user_id: string ) {
    this.channelService.openDirectChannel(this.userService.currentUser.id, user_id);
  }
}
