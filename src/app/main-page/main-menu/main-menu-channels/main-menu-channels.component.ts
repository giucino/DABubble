import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddChannelCardComponent } from './add-channel-card/add-channel-card.component';
import { CustomDialogService } from '../../../services/custom-dialog.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { ChannelTypeEnum } from '../../../shared/enums/channel-type.enum';
import { Channel } from '../../../interfaces/channel.interface';
import { ChannelComponent } from '../../channel/channel.component';
import { MessageService } from '../../../firebase.service/message.service';
import { UserService } from '../../../firebase.service/user.service';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { Message } from '../../../interfaces/message.interface';
import { ThreadService } from '../../../services/thread.service';
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
    private stateService: StateManagementService
  ) {}

  ngOnInit(): void {
    this.stateService.getSelectedChannelId().subscribe(id => {
      this.activeChannelId = id ? id : '';
    });
}

selectChannel(channelId: string) {
  this.stateService.setSelectedChannelId(channelId);
}


  // keine funktion mehr
  // openChannel(channel_id: string): void {
  //     this.router.navigate(['/main-page']).then(() => {
  //       this.channelService.setCurrentChannel(channel_id);
  //       this.messageService.getMessagesFromChannel(channel_id);

  //         this.router.navigate(['/main-page/', channel_id]);
  //     });
  //     console.log('messagees', this.messageService.messages);

  //     //lade bildfschirm für sekunde oder 2 eventuell 
  //     //check if currentuser is wirklich im channel, if not dann bleibt auf main-page, wegen url kopie
  // }

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
    // console.log(this.channelService.currentChannel);
  }
}
