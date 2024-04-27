import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MatDialogModule,
  MatDialog,
} from '@angular/material/dialog';
import { ChannelService } from '../../../../services/channel.service';
import { ChannelFirebaseService } from '../../../../firebase.service/channelFirebase.service';
import { ChannelTypeEnum } from '../../../../shared/enums/channel-type.enum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-channel-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: './add-channel-card.component.html',
  styleUrl: './add-channel-card.component.scss',
})
export class AddChannelCardComponent implements OnInit {
  channelService = inject(ChannelService);
  channelFirebaseService = inject(ChannelFirebaseService);
  name: string = '';
  description: string = '';
  created_at: number = Date.now();
  creator: string = 'user_id';
  members: string[] = ['user_id'];
  active_members: string[] = ['user_id'];
  channel_type: ChannelTypeEnum = ChannelTypeEnum.main;

  constructor(
    public dialogRef: MatDialogRef<AddChannelCardComponent>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.channelFirebaseService.getChannels().subscribe((channels) => {
      this.channelService.channelsSig.set(channels);
      console.log('Channels fetched', channels);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createChannel(): void {
    this.channelFirebaseService
      .addChannel(
        this.name,
        this.description,
        this.created_at,
        this.creator,
        this.members,
        this.active_members,
        this.channel_type
      )
      .subscribe((addedChannelId) => {
        this.channelService.addChannel(
          'name',
          'description',
          Date.now(),
          'user_id',
          ['user_id'],
          ['user_id'],
          ChannelTypeEnum.main,
          addedChannelId
        );
      });
    this.dialogRef.close();
  }
}
