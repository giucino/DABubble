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

@Component({
  selector: 'app-main-menu-channels',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
  ],
  templateUrl: './main-menu-channels.component.html',
  styleUrl: './main-menu-channels.component.scss',
})
export class MainMenuChannelsComponent implements OnInit {
  isExpanded: boolean = true;

  constructor(private customDialogService: CustomDialogService,
     public channelService : ChannelFirebaseService, public messageService: MessageService) {
  }

  ngOnInit(): void {
    
  }

  openChannel(channel_id: string): void {
    this.channelService.setCurrentChannel(channel_id);
    this.channelService.getAllChannels();
  }

  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
  }

  openAddChannelDialog(): void {
    const component = AddChannelCardComponent;
    this.customDialogService.openDialog(component);
  }
}
