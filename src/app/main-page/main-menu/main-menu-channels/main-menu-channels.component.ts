import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { DynamicContentComponent } from '../../../shared/dynamic-content/dynamic-content.component';
import { AddChannelCardComponent } from './add-channel-card/add-channel-card.component';
import { CustomDialogService } from '../../../services/custom-dialog.service';
import { ChannelService } from '../../../services/channel.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { ChannelTypeEnum } from '../../../shared/enums/channel-type.enum';
import { Observable } from 'rxjs';
import { Channel } from '../../../interfaces/channel.interface';

@Component({
  selector: 'app-main-menu-channels',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    DynamicContentComponent,
  ],
  templateUrl: './main-menu-channels.component.html',
  styleUrl: './main-menu-channels.component.scss',
})
export class MainMenuChannelsComponent implements OnInit {
  isExpanded = true;



  constructor(private customDialogService: CustomDialogService, public channelService : ChannelFirebaseService) {
  }

  ngOnInit(): void {

  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }

  openAddChannelDialog() {
    const component = AddChannelCardComponent;
    this.customDialogService.openDialog(component);
  }
}
