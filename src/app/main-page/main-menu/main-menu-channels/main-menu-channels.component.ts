import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddChannelCardComponent } from './add-channel-card/add-channel-card.component';
import { CustomDialogService } from '../../../services/custom-dialog.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { MessageService } from '../../../firebase.service/message.service';
import { UserService } from '../../../firebase.service/user.service';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { ThreadService } from '../../../services/thread.service';
import { MainMenuComponent } from '../main-menu.component';
import { SharedService } from '../../../services/shared.service';
import { StateManagementService } from '../../../services/state-management.service';

@Component({
  selector: 'app-main-menu-channels',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule, RouterModule],
  templateUrl: './main-menu-channels.component.html',
  styleUrl: './main-menu-channels.component.scss',
})
export class MainMenuChannelsComponent implements OnInit {

  isExpanded: boolean = true;
  activeChannelId: string = '';

  constructor(
    private customDialogService: CustomDialogService,
    public channelService: ChannelFirebaseService,
    public messageService: MessageService,
    public userService: UserService,
    public router: Router,
    public threadService : ThreadService,
    public mainmenu: MainMenuComponent,
    public sharedService: SharedService,
    private stateService: StateManagementService,
  ) {}

  ngOnInit(): void {
    this.stateService.getSelectedChannelId().subscribe(id => {
      this.activeChannelId = id ? id : '';
    });
}

selectChannel(channelId: string) {
  this.stateService.setSelectedChannelId(channelId);
}



  mobileChange() {
    this.mainmenu.toggleMenu();
    this.sharedService.showMobileDiv();
  }

  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
  }

  openAddChannelDialog(): void {
    const component = AddChannelCardComponent;
    this.customDialogService.openDialog(component);
  }

  closeThread() {
    this.userService.saveLastThread(this.userService.currentUser.id, '');
    this.threadService.closeThread();
    console.log(this.channelService.currentChannel);
  }
  
}
