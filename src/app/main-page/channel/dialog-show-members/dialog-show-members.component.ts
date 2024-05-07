import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { Channel } from '../../../interfaces/channel.interface';
import { CustomDialogService } from '../../../services/custom-dialog.service';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { ProfileService } from '../../../services/profile.service';
import { DialogShowProfileComponent } from '../../../shared/dialog-show-profile/dialog-show-profile.component';


@Component({
  selector: 'app-dialog-show-members',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './dialog-show-members.component.html',
  styleUrl: './dialog-show-members.component.scss',
})
export class DialogShowMembersComponent {
  currentChannel: Channel = this.channelService.currentChannel;

  constructor(
    public dialogRef: MatDialogRef<DialogShowMembersComponent>,
    public customDialogService: CustomDialogService,
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    private profileService: ProfileService
  ) {}

  openAddUserDialog(button: HTMLElement) {
    const component = DialogAddMemberComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');
    this.dialogRef.close();
  }

  openUserProfile(userId: string, button: HTMLElement): void {
    this.profileService.setOwnProfileStatus(false);
    this.profileService.setViewingUserId(userId);

    const component = DialogShowProfileComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');
    this.dialogRef.close();
  }
  
}
